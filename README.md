# AI Learning Roadmap Generator with PDF Notes 🗺️📚

An intelligent learning roadmap generator that creates personalized learning paths for any topic, provides curated resources, and now generates comprehensive PDF notes from YouTube videos!

## Features ✨

### Core Features
- **AI-Powered Roadmap Generation**: Creates structured learning paths using Google Gemini AI
- **Interactive Visual Roadmaps**: Beautiful Mermaid diagrams with clickable steps
- **YouTube Video Recommendations**: Automatically finds the best tutorial videos for each learning step
- **Book Recommendations**: Direct Amazon search links for relevant books

### New PDF Notes Generation Feature 🆕
- **Automatic Transcript Extraction**: Extracts transcripts from YouTube videos
- **AI-Generated Study Notes**: Creates comprehensive, well-structured notes from video content
- **Beautiful PDF Format**: Professional PDF documents with proper formatting and styling
- **Fallback Support**: Generates topic-based notes even if video transcript is unavailable
- **Instant Download**: One-click PDF download with organized filename

## Technology Stack 🛠️

- **Frontend**: Streamlit
- **AI Model**: Google Gemini 2.5 Pro
- **APIs**: 
  - YouTube Data API v3
  - YouTube Transcript API
- **PDF Generation**: ReportLab
- **Visualization**: Mermaid diagrams via streamlit-mermaid

## Installation 📦

1. Clone the repository:
```bash
git clone <repository-url>
cd jee_ai_app
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up API keys:
   - Create a `.streamlit/secrets.toml` file
   - Add your API keys:
```toml
GEMINI_API_KEY = "your-gemini-api-key"
YOUTUBE_API_KEY = "your-youtube-api-key"
```

## Usage 🚀

1. Run the application:
```bash
streamlit run app.py
```

2. Enter any topic you want to learn
3. Click "Generate Roadmap" to create your learning path
4. Click on any step in the roadmap to get resources
5. For each step, you'll get:
   - A YouTube video tutorial
   - Book recommendations
   - **NEW**: Generate PDF notes from the video

## PDF Notes Generation Process 📝

1. **Video Selection**: When you click on a roadmap step, the app finds the best YouTube video
2. **Transcript Extraction**: Click "Generate PDF Notes" to extract the video's transcript
3. **AI Processing**: Gemini AI analyzes the transcript and creates structured notes
4. **PDF Creation**: Notes are formatted into a professional PDF document
5. **Download**: Click the download button to save the PDF to your device

### PDF Notes Include:
- Main topic overview
- Key concepts with explanations
- Important points in bullet format
- Step-by-step procedures (when applicable)
- Tips and best practices
- Comprehensive summary
- Source video information
- Generation date

## API Keys Required 🔑

1. **Google Gemini API Key**: 
   - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
   
2. **YouTube Data API Key**:
   - Get it from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3

## Dependencies 📚

- streamlit==1.29.0
- google-generativeai==0.3.2
- google-api-python-client==2.111.0
- streamlit-mermaid==0.2.0
- youtube-transcript-api==0.6.1
- reportlab==4.0.7
- Pillow==10.1.0

## Troubleshooting 🔧

### Common Issues:

1. **"Could not extract transcript"**: 
   - The video might not have captions enabled
   - The app will automatically generate general notes for the topic instead

2. **API Quota Exceeded**:
   - YouTube API has daily quotas
   - Consider waiting or using a different API key

3. **PDF Generation Errors**:
   - Ensure all dependencies are installed
   - Check that reportlab is properly installed

## Future Enhancements 🚀

- [ ] Support for multiple languages
- [ ] Export roadmap as JSON/PDF
- [ ] Save and load previous roadmaps
- [ ] Integration with more learning platforms
- [ ] Collaborative learning features
- [ ] Progress tracking

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

If you encounter any issues or have questions, please open an issue in the repository.

---

**Made with ❤️ using Streamlit and Google Gemini AI**
