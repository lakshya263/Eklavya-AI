import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';
import { FaEye, FaList, FaProjectDiagram } from 'react-icons/fa';

// Context
import { useRoadmap } from '../contexts/RoadmapContext';

// Styled components
import { Card, Button, SectionTitle } from '../styles/GlobalStyles';

const VisualizationContainer = styled(motion.div)`
  margin-bottom: 3rem;
`;

const ViewControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ViewButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${props => props.active && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  `}
`;

const MermaidContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 400px;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  .mermaid {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 350px;
  }
`;

const InteractiveContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const CategoryExpander = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const CategoryHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
`;

const CategoryContent = styled(motion.div)`
  padding: 1.5rem;
`;

const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const TopicButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: #333;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RoadmapVisualization = () => {
  const { roadmapStructure, mainTopic, setSelectedTopic } = useRoadmap();
  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'interactive'
  const [expandedCategories, setExpandedCategories] = useState({});
  const mermaidRef = useRef(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#5a67d8',
        lineColor: '#764ba2',
        secondaryColor: '#f8f9ff',
        tertiaryColor: '#f1f5f9'
      }
    });
  }, []);

  // Build Mermaid diagram string (converted from Python function)
  const buildMermaidString = (data, parent = null, counter = { value: 0 }) => {
    let mermaidStr = '';
    
    Object.entries(data).forEach(([key, value]) => {
      const currentNodeId = `node${counter.value}`;
      counter.value++;
      
      const safeKey = JSON.stringify(key);
      mermaidStr += `    ${currentNodeId}[${safeKey}];\n`;
      
      if (parent) {
        mermaidStr += `    ${parent} --> ${currentNodeId};\n`;
      }
      
      value.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const nestedStr = buildMermaidString(item, currentNodeId, counter);
          mermaidStr += nestedStr;
        } else {
          const leafNodeId = `node${counter.value}`;
          counter.value++;
          const safeItem = JSON.stringify(item);
          mermaidStr += `    ${leafNodeId}[${safeItem}];\n`;
          mermaidStr += `    ${currentNodeId} --> ${leafNodeId};\n`;
        }
      });
    });
    
    return mermaidStr;
  };

  // Generate Mermaid diagram
  useEffect(() => {
    if (Object.keys(roadmapStructure).length > 0 && mermaidRef.current && viewMode === 'visual') {
      const mermaidCode = `graph LR;\n${buildMermaidString(roadmapStructure)}`;
      
      // Clear previous diagram
      mermaidRef.current.innerHTML = '';
      
      // Render new diagram
      mermaid.render('roadmap-diagram', mermaidCode, (svgCode) => {
        mermaidRef.current.innerHTML = svgCode;
      });
    }
  }, [roadmapStructure, viewMode]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Render interactive roadmap UI (converted from Python function)
  const renderInteractiveRoadmap = (data) => {
    return Object.entries(data).map(([category, items]) => (
      <CategoryExpander
        key={category}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CategoryHeader onClick={() => toggleCategory(category)}>
          <span>📁</span>
          {category}
        </CategoryHeader>
        
        {expandedCategories[category] && (
          <CategoryContent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TopicGrid>
              {items.map((item, index) => {
                if (typeof item === 'object' && item !== null) {
                  // Handle nested objects
                  return (
                    <div key={index}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#667eea' }}>
                        🔹 Subcategories:
                      </h4>
                      {renderInteractiveRoadmap(item)}
                    </div>
                  );
                } else {
                  return (
                    <TopicButton
                      key={index}
                      onClick={() => handleTopicSelect(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🎯 {item.length > 40 ? `${item.substring(0, 37)}...` : item}
                    </TopicButton>
                  );
                }
              })}
            </TopicGrid>
          </CategoryContent>
        )}
      </CategoryExpander>
    ));
  };

  // Don't render if no roadmap structure
  if (Object.keys(roadmapStructure).length === 0) {
    return null;
  }

  return (
    <VisualizationContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SectionTitle>
        📋 Your JEE Study Roadmap for "{mainTopic}"
      </SectionTitle>

      <ViewControls>
        <ViewButton
          active={viewMode === 'visual'}
          onClick={() => setViewMode('visual')}
        >
          <FaProjectDiagram />
          Visual Roadmap
        </ViewButton>
        
        <ViewButton
          active={viewMode === 'interactive'}
          onClick={() => setViewMode('interactive')}
        >
          <FaList />
          Interactive Learning Path
        </ViewButton>
      </ViewControls>

      <Card>
        {viewMode === 'visual' ? (
          <>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
              <FaEye /> Visual Roadmap Tree
            </h3>
            <MermaidContainer>
              <div ref={mermaidRef} className="mermaid" />
            </MermaidContainer>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
              <FaList /> Interactive Learning Path
            </h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
              Click on any sub-topic to get learning resources
            </p>
            <InteractiveContainer>
              {renderInteractiveRoadmap(roadmapStructure)}
            </InteractiveContainer>
          </>
        )}
      </Card>
    </VisualizationContainer>
  );
};

export default RoadmapVisualization;
