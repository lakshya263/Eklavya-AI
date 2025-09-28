import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { RoadmapProvider } from './contexts/RoadmapContext';

// Components
import Header from './components/Header';
import RoadmapGenerator from './components/RoadmapGenerator';
import RoadmapVisualization from './components/RoadmapVisualization';
import ResourcePanel from './components/ResourcePanel';

// Styles
import { GlobalStyles, AppContainer, MainContent } from './styles/GlobalStyles';

function App() {
  return (
    <RoadmapProvider>
      <Router>
        <GlobalStyles />
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={
                <>
                  <RoadmapGenerator />
                  <RoadmapVisualization />
                  <ResourcePanel />
                </>
              } />
            </Routes>
          </MainContent>
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AppContainer>
      </Router>
    </RoadmapProvider>
  );
}

export default App;
