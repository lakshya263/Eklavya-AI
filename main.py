# main.py - Your Backend API

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import google.generativeai as genai
from googleapiclient.discovery import build
import urllib.parse
import re
import os

# --- 1. API Configuration & Key Loading ---

# It's better to load secrets using environment variables in a real app,
# but for simplicity, we'll assume they are accessible.
# Make sure to set these in your hosting environment (e.g., Vercel, Render).
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")
SEARCH_ENGINE_ID = os.environ.get("SEARCH_ENGINE_ID")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize the FastAPI app
app = FastAPI()

# --- IMPORTANT: Add CORS Middleware ---
# This allows your frontend website to make requests to this backend API.
origins = [
    "http://localhost:3000",  # Your frontend's local development URL
    # "https://your-production-website.com" # Your deployed website URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Pydantic Models for Request Body ---

class RoadmapRequest(BaseModel):
    topic: str

# --- 3. AI & Resource Functions (from your Streamlit app) ---

VALID_GEMINI_MODEL = 'gemini-1.5-pro-latest'

def generate_roadmap_structure(topic: str):
    model = genai.GenerativeModel(VALID_GEMINI_MODEL)
    prompt = f"""
    You are an expert tutor for the Indian Joint Entrance Examination (JEE).
    Create a comprehensive, hierarchical learning roadmap for the JEE topic: '{topic}'.
    The structure must be a nested JSON object. Values can be a list of strings, or a list containing strings and other nested objects.
    Example for 'Calculus':
    {{
        "Limits, Continuity & Differentiability": ["Limits", "Continuity", {{"Theorems": ["Rolle's", "Lagrange's"]}}],
        "Applications of Derivatives": ["Rate of Change", "Tangents and Normals"]
    }}
    Return ONLY the valid JSON object.
    """
    try:
        response = model.generate_content(prompt)
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {}
    except Exception as e:
        print(f"Error in generate_roadmap_structure: {e}")
        return {"error": str(e)}

def get_youtube_video(query: str):
    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.search().list(q=f"{query} JEE tutorial", part='snippet', maxResults=1, type='video', order='viewCount')
        response = request.execute()
        if response and response.get('items'):
            item = response['items'][0]
            return {"title": item['snippet']['title'], "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"}
    except Exception as e:
        print(f"Error in get_youtube_video: {e}")
    return {}

def get_online_articles(query: str):
    try:
        service = build("customsearch", "v1", developerKey=YOUTUBE_API_KEY)
        res = service.cse().list(q=f"{query} JEE study material article", cx=SEARCH_ENGINE_ID, num=3).execute()
        return [{"title": item['title'], "link": item['link']} for item in res.get('items', [])]
    except Exception as e:
        print(f"Error in get_online_articles: {e}")
        return []

# --- 4. API Endpoints ---

@app.post("/generate-roadmap")
async def generate_roadmap_endpoint(request: RoadmapRequest):
    """
    Receives a topic and returns the full hierarchical roadmap structure.
    """
    roadmap_data = generate_roadmap_structure(request.topic)
    return roadmap_data

@app.get("/get-resources/{topic}")
async def get_resources_endpoint(topic: str):
    """
    Receives a specific sub-topic and returns a collection of resources.
    """
    topic = urllib.parse.unquote(topic) # Decode URL-encoded topic
    youtube_video = get_youtube_video(topic)
    articles = get_online_articles(topic)
    
    return {
        "youtube_video": youtube_video,
        "articles": articles
    }

# --- 5. Health Check Endpoint ---
@app.get("/")
async def root():
    return {"message": "AI Roadmap Generator API is running!"}