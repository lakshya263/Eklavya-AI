import React from 'react';
import styled from 'styled-components';
import { FaGraduationCap, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }
  
  .icon {
    font-size: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavItem = styled(motion.div)`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const StatusBadge = styled(motion.div)`
  background: rgba(46, 160, 67, 0.2);
  color: #2ea043;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(46, 160, 67, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaGraduationCap className="icon" />
          <h1>AI JEE Roadmap Generator</h1>
        </Logo>
        
        <Nav>
          <NavItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            React Version
          </NavItem>
          
          <StatusBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FaRocket size={12} />
            Live
          </StatusBadge>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
