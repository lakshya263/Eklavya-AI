import streamlit as st
import json
import google.generativeai as genai
from googleapiclient.discovery import build
from streamlit_mermaid import st_mermaid
import urllib.parse
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
import io
import base64
from datetime import datetime

# --- 1. API Configuration & Page Setup ---

st.set_page_config(page_title="AI JEE Roadmap Generator", page_icon="📚", layout="wide")
st.title("AI JEE Roadmap Generator 📚")
st.write("Enter a JEE subject or chapter to get a detailed, hierarchical study roadmap!")

# Securely fetch API keys
try:
    GEMINI_API_KEY = st.secrets["GEMINI_API_KEY"]
    YOUTUBE_API_KEY = st.secrets["YOUTUBE_API_KEY"]
    SEARCH_ENGINE_ID = st.secrets["SEARCH_ENGINE_ID"]
    genai.configure(api_key=GEMINI_API_KEY)
except KeyError as e:
    st.error(f"🚨 API Key not found: {e}. Please add it to your .streamlit/secrets.toml file.", icon="🔑")
    st.stop()
except Exception as e:
    st.error(f"🚨 An error occurred during API configuration: {e}")
    st.stop()

# --- 2. AI & Resource Functions ---

VALID_GEMINI_MODEL = 'gemini-2.5-pro'

def generate_roadmap_structure(topic):
    model = genai.GenerativeModel(VALID_GEMINI_MODEL)
    prompt = f"""
    You are an expert tutor for the Indian Joint Entrance Examination (JEE).
    Create a comprehensive, hierarchical learning roadmap for the JEE topic: '{topic}'.
    The structure must be a nested JSON object. Values can be a list of strings, or a list containing strings and other nested objects.

    Example for 'Calculus':
    {{
        "Limits, Continuity & Differentiability": [
            "Limits of Functions",
            "Continuity",
            "Differentiability",
            {{"Mean Value Theorems": ["Rolle's Theorem", "Lagrange's MVT"]}}
        ],
        "Applications of Derivatives": [
            "Rate of Change",
            "Tangents and Normals",
            "Maxima and Minima"
        ]
    }}
    
    Create a detailed roadmap for '{topic}' following this exact nested structure.
    Return ONLY the valid JSON object.
    """
    try:
        response = model.generate_content(prompt)
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
        else:
            st.error("Failed to find a valid JSON object in the AI response.")
            st.code(response.text)
            return {}
    except Exception as e:
        st.error(f"An error occurred while calling the AI model: {e}")
        return {}

def get_youtube_video(query):
    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.search().list(q=f"{query} JEE tutorial", part='snippet', maxResults=1, type='video', order='viewCount')
        response = request.execute()
        if response and response.get('items'):
            video_id = response['items'][0]['id']['videoId']
            video_title = response['items'][0]['snippet']['title']
            return video_title, f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        st.error(f"Could not fetch YouTube video. Check your YouTube API Key and quota. Error: {e}")
    return "No video found.", ""

def get_online_articles(query):
    try:
        service = build("customsearch", "v1", developerKey=YOUTUBE_API_KEY)
        res = service.cse().list(
            q=f"{query} JEE study material article",
            cx=SEARCH_ENGINE_ID,
            num=3
        ).execute()
        if 'items' in res:
            return res['items']
        else:
            return []
    except Exception as e:
        st.error(f"Could not fetch articles. Check your Custom Search API setup. Error: {e}")
        return []

def generate_notes_from_topic(topic):
    model = genai.GenerativeModel(VALID_GEMINI_MODEL)
    prompt = f"""
    You are an expert tutor for the Indian Joint Entrance Examination (JEE).
    Create a comprehensive set of study notes for a beginner learning the JEE topic: '{topic}'.
    Include Key Formulas, Core Concepts, Problem-Solving Tips, and a Summary.
    Format the output using clear headings and markdown.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating notes: {str(e)}"

def create_pdf_from_notes(notes, topic):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=18)
    story = []
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('CustomTitle', parent=styles['Title'], fontSize=24, textColor=colors.HexColor('#1f77b4'), spaceAfter=30, alignment=TA_CENTER)
    heading_style = ParagraphStyle('CustomHeading', parent=styles['h2'], fontSize=14, textColor=colors.HexColor('#2ca02c'), spaceAfter=12, spaceBefore=12)
    body_style = ParagraphStyle('CustomBody', parent=styles['BodyText'], fontSize=11, alignment=TA_JUSTIFY, spaceAfter=12)
    
    story.append(Paragraph(f"JEE Study Notes: {topic}", title_style))
    story.append(Paragraph(f"<b>Generated on:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
    story.append(Spacer(1, 0.3*inch))
    
    for line in notes.split('\n'):
        if line.strip():
            clean_line = line.replace('**', '').strip()
            if clean_line.startswith(('1.', '2.', '3.', '4.', '5.', '6.')) or len(clean_line) < 60 and (clean_line.endswith(':') or clean_line.isupper()):
                para = Paragraph(f"<b>{clean_line}</b>", heading_style)
            else:
                formatted_line = re.sub(r'\*(.*?)\*', r'<i>\1</i>', clean_line)
                para = Paragraph(formatted_line, body_style)
            story.append(para)
            
    doc.build(story)
    buffer.seek(0)
    return buffer

def get_download_link(buffer, filename):
    b64 = base64.b64encode(buffer.read()).decode()
    return f'<a href="data:application/pdf;base64,{b64}" download="{filename}" style="display: inline-block; padding: 12px 20px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">📥 Download PDF Notes</a>'


# --- 3. UI HELPER FUNCTIONS ---

def build_mermaid_string(data, parent=None, mermaid_str="", counter=0):
    for key, value in data.items():
        current_node_id = f"node{counter}"
        counter += 1
        safe_key = json.dumps(key)
        mermaid_str += f'    {current_node_id}[{safe_key}];\n'
        if parent:
            mermaid_str += f'    {parent} --> {current_node_id};\n'
        
        for item in value:
            if isinstance(item, dict):
                mermaid_str, counter = build_mermaid_string(item, parent=current_node_id, mermaid_str=mermaid_str, counter=counter)
            else:
                leaf_node_id = f"node{counter}"
                counter += 1
                safe_item = json.dumps(item)
                mermaid_str += f'    {leaf_node_id}[{safe_item}];\n'
                mermaid_str += f'    {current_node_id} --> {leaf_node_id};\n'
    return mermaid_str, counter

def display_roadmap_ui(data, counter_list):
    for category, items in data.items():
        with st.expander(f"📁 {category}", expanded=True):
            # Create columns for better layout - ensure at least 1 column
            non_dict_items = [item for item in items if not isinstance(item, dict)]
            num_cols = max(1, min(3, len(non_dict_items)))  # Ensure at least 1 column
            cols = st.columns(num_cols)
            col_idx = 0
            
            for item in items:
                if isinstance(item, dict):
                    # Handle nested subcategories
                    st.markdown(f"**🔹 Subcategories:**")
                    display_roadmap_ui(item, counter_list)
                else:
                    # Display items in columns
                    with cols[col_idx % len(cols)] if cols else st.container():
                        # Create a styled button that clearly shows it's clickable
                        button_text = item if len(item) <= 40 else item[:37] + "..."
                        if st.button(
                            f"🎯 {button_text}", 
                            key=f"roadmap_btn_{counter_list[0]}", 
                            use_container_width=True,
                            help=f"Click to get study resources for: {item}",
                            type="secondary"
                        ):
                            st.session_state.selected_topic = item
                            st.session_state.show_resources = True
                            # Force refresh to show resources immediately
                            st.rerun()
                    counter_list[0] += 1
                    col_idx += 1

# --- 4. MAIN APP LOGIC ---

if 'roadmap_structure' not in st.session_state:
    st.session_state.roadmap_structure = {}
    st.session_state.selected_topic = None
    st.session_state.show_resources = False
    st.session_state.main_topic = ""  # Store the main topic

main_topic = st.text_input("🎯 What do you want to learn for JEE?", placeholder="e.g., Fluid Mechanics, Calculus, Organic Chemistry...")

if st.button("🚀 Generate My Study Roadmap", key="generate_button", type="primary"):
    if main_topic:
        with st.spinner("🤖 AI is generating your JEE study plan..."):
            st.session_state.roadmap_structure = generate_roadmap_structure(main_topic)
            st.session_state.selected_topic = None
            st.session_state.show_resources = False
            st.session_state.main_topic = main_topic  # Store the topic
    else:
        st.warning("Please enter a topic.")

if st.session_state.get("roadmap_structure"):
    st.subheader(f"📋 Your JEE Study Roadmap for '{st.session_state.main_topic}'")
    
    st.markdown("---")
    st.write("**Visual Roadmap Tree**")
    
    # --- THIS IS THE MODIFIED LINE ---
    # We've changed "TD" (Top to Down) to "LR" (Left to Right) for a horizontal layout.
    mermaid_code, _ = build_mermaid_string(st.session_state.roadmap_structure, mermaid_str="graph LR;\n")
    # --- END OF MODIFIED LINE ---

    st_mermaid(mermaid_code, height="800px", key="roadmap_visual")
    
    st.markdown("---")
    st.write("**Interactive Learning Path**")
    st.write("*Click on any sub-topic to get learning resources.*")
    display_roadmap_ui(st.session_state.roadmap_structure, [0])

if st.session_state.selected_topic and st.session_state.get('show_resources', False):
    # Add a large separator to make resources section highly visible
    st.markdown("---")
    st.markdown("---")
    
    # Enhanced header with better styling and animation
    st.markdown(f"""
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); 
                padding: 25px; 
                border-radius: 15px; 
                margin: 20px 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                border: 1px solid rgba(255,255,255,0.2);">
        <h1 style="color: white; text-align: center; margin: 0; font-size: 2.2em;">
            📚 JEE Study Resources
        </h1>
        <h2 style="color: white; text-align: center; margin: 10px 0; font-size: 1.5em;">
            Topic: {st.session_state.selected_topic}
        </h2>
        <p style="color: white; text-align: center; margin: 5px 0; opacity: 0.95; font-size: 1.1em;">
            🎯 Everything you need to master this JEE topic
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Add a success message to confirm selection
    st.success(f"✅ Great choice! You've selected: **{st.session_state.selected_topic}**")
    st.info("📖 Here are the best study resources to help you master this topic:")
    
    # Add a clear selection button
    col_clear1, col_clear2, col_clear3 = st.columns([1, 1, 1])
    with col_clear2:
        if st.button("🔄 Clear Selection & Choose New Topic", key="clear_selection", help="Clear current selection and choose another topic", type="secondary"):
            st.session_state.selected_topic = None
            st.session_state.show_resources = False
            st.rerun()
    
    st.write("") # Add some space
    
    with st.spinner("🔍 Finding the best JEE resources for you..."):
        res_col1, res_col2, res_col3 = st.columns(3)

        with res_col1:
            st.markdown("#### 🎓 Top YouTube Tutorial")
            video_title, video_url = get_youtube_video(st.session_state.selected_topic)
            if video_url:
                st.video(video_url)
                st.write(video_title)
            else:
                st.write("No video found.")

        with res_col2:
            st.markdown("#### 🔎 Top Online Articles")
            articles = get_online_articles(st.session_state.selected_topic)
            if articles:
                for article in articles:
                    st.markdown(f"- [{article['title']}]({article['link']})")
            else:
                st.write("No articles found.")
            
        with res_col3:
            st.markdown("#### 📝 PDF Study Notes Generator")
            if st.button("🤖 Generate PDF Study Notes", key="generate_pdf_notes", use_container_width=True):
                with st.spinner(f"Creating comprehensive study notes..."):
                    notes = generate_notes_from_topic(st.session_state.selected_topic)
                    if notes and not notes.startswith("Error"):
                        pdf_buffer = create_pdf_from_notes(notes, st.session_state.selected_topic)
                        safe_topic = re.sub(r'[^a-zA-Z0-9_-]', '_', st.session_state.selected_topic)
                        filename = f"{safe_topic}_JEE_notes_{datetime.now().strftime('%Y%m%d')}.pdf"
                        download_link = get_download_link(pdf_buffer, filename)
                        st.markdown(download_link, unsafe_allow_html=True)
                        st.success("✅ PDF study notes generated!")
                    else:
                        st.error(f"❌ Failed to generate notes: {notes}")