import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

// Context and services
import { useRoadmap } from '../contexts/RoadmapContext';
import { aiService } from '../services/api';

// Styled components
import { Card, Button, Input, LoadingContainer, GradientText } from '../styles/GlobalStyles';

const GeneratorContainer = styled(motion.div)`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  color: white;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const GenerateButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  padding: 1.25rem 2rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const RoadmapGenerator = () => {
  const [topic, setTopic] = useState('');
  const { 
    isLoading, 
    setLoading, 
    setError, 
    setRoadmapStructure, 
    clearSelection 
  } = useRoadmap();

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a JEE topic or subject!');
      return;
    }

    try {
      setLoading(true);
      clearSelection(); // Clear any previous selection
      
      // Call AI service to generate roadmap
      const result = await aiService.generateRoadmap(topic.trim());
      
      if (result.success && result.roadmap) {
        setRoadmapStructure(result.roadmap, result.topic);
        toast.success(`🎉 Roadmap generated for "${result.topic}"!`);
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('Roadmap generation error:', error);
      setError(error.message);
      toast.error(`Failed to generate roadmap: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerateRoadmap();
    }
  };

  return (
    <GeneratorContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Title>
        AI JEE Roadmap Generator <span role="img" aria-label="books">📚</span>
      </Title>
      
      <Subtitle>
        Enter a JEE subject or chapter to get a detailed, hierarchical study roadmap 
        powered by <GradientText>Gemini AI</GradientText>!
      </Subtitle>

      <Card large>
        {isLoading ? (
          <LoadingContainer>
            <ClipLoader color="#667eea" size={50} className="spinner" />
            <p>
              <FaBrain /> AI is generating your personalized JEE study plan...
            </p>
          </LoadingContainer>
        ) : (
          <>
            <InputContainer>
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Fluid Mechanics, Calculus, Organic Chemistry, Thermodynamics..."
                disabled={isLoading}
              />
            </InputContainer>

            <GenerateButton
              primary
              large
              onClick={handleGenerateRoadmap}
              disabled={isLoading || !topic.trim()}
            >
              <FaRocket />
              Generate My Study Roadmap
            </GenerateButton>
          </>
        )}

        {/* Statistics Cards */}
        <StatsContainer>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>AI</h3>
            <p>Powered by Gemini</p>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>∞</h3>
            <p>Unlimited Topics</p>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>PDF</h3>
            <p>Study Notes</p>
          </StatCard>
        </StatsContainer>
      </Card>
    </GeneratorContainer>
  );
};

export default RoadmapGenerator;
