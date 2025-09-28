import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaYoutube, FaNewspaper, FaFilePdf, FaDownload, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

// Context and services
import { useRoadmap } from '../contexts/RoadmapContext';
import { resourceService, aiService } from '../services/api';

// Styled components
import { Card, Button, Grid, LoadingContainer } from '../styles/GlobalStyles';

const ResourceContainer = styled(motion.div)`
  margin-top: 3rem;
`;

const ResourceHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.95;
  }
  
  p {
    opacity: 0.9;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

const AlertBanner = styled(motion.div)`
  background: ${props => props.type === 'success' ? 'rgba(46, 160, 67, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(46, 160, 67, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.type === 'success' ? '#2ea043' : '#3b82f6'};
`;

const CloseButton = styled(Button)`
  background: transparent;
  color: #666;
  padding: 0.5rem;
  border-radius: 6px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: none;
  }
`;

const ResourceCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.2rem;
  }
`;

const VideoContainer = styled.div`
  .video-embed {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 1rem;
    
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  
  .video-title {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.4;
  }
`;

const ArticleList = styled.div`
  flex: 1;
  
  .article-item {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .snippet {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.5rem;
      line-height: 1.4;
    }
  }
`;

const PDFSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  .generate-btn {
    width: 100%;
  }
  
  .download-area {
    padding: 2rem;
    border: 2px dashed #667eea;
    border-radius: 12px;
    text-align: center;
    background: rgba(102, 126, 234, 0.05);
    width: 100%;
    
    .success-message {
      color: #2ea043;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  }
`;

const ResourcePanel = () => {
  const { 
    selectedTopic, 
    showResources, 
    clearSelection,
    resources,
    setResources
  } = useRoadmap();
  
  const [loadingStates, setLoadingStates] = useState({
    video: false,
    articles: false,
    pdf: false
  });
  
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // Load resources when topic is selected
  useEffect(() => {
    if (selectedTopic && showResources) {
      loadAllResources();
    }
  }, [selectedTopic, showResources]);

  const loadAllResources = async () => {
    if (!selectedTopic) return;

    // Load YouTube video
    loadYouTubeVideo();
    
    // Load articles
    loadArticles();
  };

  const loadYouTubeVideo = async () => {
    setLoadingStates(prev => ({ ...prev, video: true }));
    
    try {
      const result = await resourceService.getYouTubeVideo(selectedTopic);
      setResources({ video: result.video });
    } catch (error) {
      console.error('Failed to load YouTube video:', error);
      setResources({ video: null });
    } finally {
      setLoadingStates(prev => ({ ...prev, video: false }));
    }
  };

  const loadArticles = async () => {
    setLoadingStates(prev => ({ ...prev, articles: true }));
    
    try {
      const result = await resourceService.getArticles(selectedTopic);
      setResources({ articles: result.articles || [] });
    } catch (error) {
      console.error('Failed to load articles:', error);
      setResources({ articles: [] });
    } finally {
      setLoadingStates(prev => ({ ...prev, articles: false }));
    }
  };

  const generatePDFNotes = async () => {
    if (!selectedTopic) return;

    setLoadingStates(prev => ({ ...prev, pdf: true }));
    setPdfGenerated(false);

    try {
      // First generate notes using AI
      toast.info('Generating comprehensive study notes...');
      const notesResult = await aiService.generateNotes(selectedTopic);
      
      if (notesResult.success && notesResult.notes) {
        // Then create and download PDF
        toast.info('Creating PDF document...');
        await resourceService.generatePDF(notesResult.notes, selectedTopic);
        
        setPdfGenerated(true);
        toast.success('📥 PDF notes generated and downloaded successfully!');
      } else {
        throw new Error('Failed to generate notes');
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, pdf: false }));
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  };

  if (!selectedTopic || !showResources) {
    return null;
  }

  return (
    <ResourceContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ResourceHeader>
        <h1>📚 JEE Study Resources</h1>
        <h2>Topic: {selectedTopic}</h2>
        <p>🎯 Everything you need to master this JEE topic</p>
      </ResourceHeader>

      <AlertBanner
        type="success"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          ✅ Great choice! You've selected: <strong>{selectedTopic}</strong>
        </div>
        <CloseButton onClick={clearSelection}>
          <FaTimes />
        </CloseButton>
      </AlertBanner>

      <AlertBanner
        type="info"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          📖 Here are the best study resources to help you master this topic
        </div>
      </AlertBanner>

      <Grid columns="repeat(auto-fit, minmax(350px, 1fr))">
        {/* YouTube Video Section */}
        <ResourceCard>
          <h3>
            <FaYoutube style={{ color: '#ff0000' }} />
            Top YouTube Tutorial
          </h3>
          
          {loadingStates.video ? (
            <LoadingContainer>
              <ClipLoader color="#667eea" size={30} />
              <p>Loading video...</p>
            </LoadingContainer>
          ) : resources.video ? (
            <VideoContainer>
              <div className="video-embed">
                <iframe
                  src={getYouTubeEmbedUrl(resources.video.url)}
                  title={resources.video.title}
                  allowFullScreen
                />
              </div>
              <p className="video-title">{resources.video.title}</p>
            </VideoContainer>
          ) : (
            <p>No video found for this topic.</p>
          )}
        </ResourceCard>

        {/* Articles Section */}
        <ResourceCard>
          <h3>
            <FaNewspaper style={{ color: '#667eea' }} />
            Top Online Articles
          </h3>
          
          {loadingStates.articles ? (
            <LoadingContainer>
              <ClipLoader color="#667eea" size={30} />
              <p>Loading articles...</p>
            </LoadingContainer>
          ) : (
            <ArticleList>
              {resources.articles && resources.articles.length > 0 ? (
                resources.articles.map((article, index) => (
                  <div key={index} className="article-item">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                    {article.snippet && (
                      <p className="snippet">{article.snippet}</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No articles found for this topic.</p>
              )}
            </ArticleList>
          )}
        </ResourceCard>

        {/* PDF Generation Section */}
        <ResourceCard>
          <h3>
            <FaFilePdf style={{ color: '#dc3545' }} />
            PDF Study Notes Generator
          </h3>
          
          <PDFSection>
            {loadingStates.pdf ? (
              <LoadingContainer>
                <ClipLoader color="#667eea" size={30} />
                <p>Creating comprehensive study notes...</p>
              </LoadingContainer>
            ) : (
              <>
                <Button
                  primary
                  className="generate-btn"
                  onClick={generatePDFNotes}
                  disabled={loadingStates.pdf}
                >
                  {loadingStates.pdf ? (
                    <>
                      <FaSpinner className="spinning" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaFilePdf />
                      Generate PDF Study Notes
                    </>
                  )}
                </Button>
                
                {pdfGenerated && (
                  <div className="download-area">
                    <div className="success-message">
                      ✅ PDF study notes generated successfully!
                    </div>
                    <p>Your PDF has been downloaded to your device.</p>
                  </div>
                )}
              </>
            )}
          </PDFSection>
        </ResourceCard>
      </Grid>
    </ResourceContainer>
  );
};

export default ResourcePanel;
