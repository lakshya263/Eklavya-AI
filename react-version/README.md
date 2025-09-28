# AI JEE Roadmap Generator - React Version 🚀📚

A modern React.js + Node.js full-stack application that generates personalized JEE learning roadmaps using AI, converted from the original Streamlit version.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Roadmap Generation**: Creates structured learning paths using Google Gemini AI
- **Interactive Visual Roadmaps**: Beautiful Mermaid diagrams with clickable steps
- **YouTube Video Recommendations**: Automatically finds the best tutorial videos for each learning step
- **PDF Study Notes**: AI-generated comprehensive study notes with instant download
- **Article Search**: Curated online articles for each topic
- **Responsive Design**: Modern, mobile-friendly interface built with React

### 🔄 Migration from Streamlit
This is a complete conversion of the original Streamlit application to a modern MERN-style stack:
- ✅ All Python functions converted to JavaScript/Node.js
- ✅ Streamlit session state replaced with React Context
- ✅ Interactive UI rebuilt with modern React components
- ✅ API endpoints for all AI and resource services
- ✅ Enhanced user experience with animations and modern design

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **Mermaid.js** - Interactive diagram visualization
- **React Context** - State management
- **Axios** - API communication
- **React Toastify** - User notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Gemini AI** - AI roadmap and notes generation
- **YouTube Data API v3** - Video recommendations
- **Custom Search API** - Article search
- **PDFKit** - PDF generation
- **CORS & Security** - Production-ready middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google AI API keys (Gemini + YouTube Data API)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd react-version/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your API keys:
   ```env
   PORT=5000
   GEMINI_API_KEY=your-gemini-api-key-here
   YOUTUBE_API_KEY=your-youtube-api-key-here
   SEARCH_ENGINE_ID=your-google-custom-search-engine-id
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd react-version/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the React development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 📋 API Endpoints

### AI Services
- `POST /api/ai/generate-roadmap` - Generate learning roadmap
- `POST /api/ai/generate-notes` - Generate study notes

### Resource Services
- `GET /api/resources/youtube/:query` - Get YouTube videos
- `GET /api/resources/articles/:query` - Get online articles
- `POST /api/resources/generate-pdf` - Generate and download PDF

### Utility
- `GET /api/health` - Health check endpoint

## 🔑 Required API Keys

### 1. Google Gemini API Key
- Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Used for AI roadmap and notes generation

### 2. YouTube Data API Key
- Get it from [Google Cloud Console](https://console.cloud.google.com/)
- Enable YouTube Data API v3
- Used for video recommendations

### 3. Google Custom Search Engine ID (Optional)
- Set up at [Google Custom Search](https://cse.google.com/)
- Used for article search functionality

## 📱 Usage

1. **Enter a JEE Topic**: Type any JEE subject (e.g., "Calculus", "Thermodynamics")
2. **Generate Roadmap**: Click the generate button to create your study plan
3. **Visualize**: Switch between visual diagram and interactive list views
4. **Explore Resources**: Click any topic to get:
   - YouTube tutorial videos
   - Related articles
   - AI-generated PDF study notes
5. **Download Notes**: Generate and download comprehensive PDF study materials

## 🔄 Key Differences from Streamlit Version

### State Management
- **Streamlit**: `st.session_state`
- **React**: React Context with useReducer hook

### UI Components
- **Streamlit**: Built-in components (`st.button`, `st.expander`)
- **React**: Custom styled components with animations

### API Integration
- **Streamlit**: Direct API calls in Python functions
- **React**: Separate backend API with Express.js routes

### Visualization
- **Streamlit**: `streamlit-mermaid` component
- **React**: Direct Mermaid.js integration with React refs

## 🏗️ Project Structure

```
react-version/
├── backend/
│   ├── routes/
│   │   ├── ai.js           # AI service endpoints
│   │   └── resources.js    # Resource service endpoints
│   ├── server.js           # Express server setup
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React Context providers
│   │   ├── services/       # API service functions
│   │   ├── styles/         # Styled components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Environment variables template
└── README.md               # This file
```

## 🚦 Development vs Production

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- CORS enabled for local development

### Production Deployment
1. **Build frontend**: `npm run build` in frontend directory
2. **Deploy backend**: Use services like Heroku, Railway, or Vercel
3. **Update environment variables**: Set production API URLs
4. **Configure CORS**: Update allowed origins for production domain

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS is configured correctly
   - Check CLIENT_URL in backend .env file

2. **API Key Errors**:
   - Verify all API keys are correctly set in backend .env
   - Check API key permissions and quotas

3. **PDF Generation Fails**:
   - Ensure PDFKit is properly installed: `npm install pdfkit`
   - Check browser download permissions

4. **Mermaid Diagrams Not Rendering**:
   - Clear browser cache
   - Check for JavaScript errors in console

## 🚀 Performance Optimizations

- **API Caching**: Implement Redis for caching AI responses
- **Image Optimization**: Add image compression for thumbnails
- **Code Splitting**: Use React.lazy for component splitting
- **Service Worker**: Add PWA capabilities for offline usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🆘 Support

If you encounter any issues:
1. Check this README for troubleshooting tips
2. Verify all environment variables are set correctly
3. Check browser console for error messages
4. Ensure all dependencies are installed

---

**Made with ❤️ using React, Node.js, and Google Gemini AI**

*Converted from the original Streamlit version to provide a modern, scalable web application experience.*
