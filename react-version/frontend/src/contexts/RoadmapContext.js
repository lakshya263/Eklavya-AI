import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  roadmapStructure: {},
  selectedTopic: null,
  showResources: false,
  mainTopic: '',
  isLoading: false,
  error: null,
  resources: {
    video: null,
    articles: [],
    notes: null
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ROADMAP_STRUCTURE: 'SET_ROADMAP_STRUCTURE',
  SET_SELECTED_TOPIC: 'SET_SELECTED_TOPIC',
  SET_SHOW_RESOURCES: 'SET_SHOW_RESOURCES',
  SET_MAIN_TOPIC: 'SET_MAIN_TOPIC',
  SET_RESOURCES: 'SET_RESOURCES',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function (similar to session state management in Streamlit)
const roadmapReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case actionTypes.SET_ROADMAP_STRUCTURE:
      return {
        ...state,
        roadmapStructure: action.payload.roadmap,
        mainTopic: action.payload.topic,
        isLoading: false,
        error: null
      };
    
    case actionTypes.SET_SELECTED_TOPIC:
      return {
        ...state,
        selectedTopic: action.payload,
        showResources: true
      };
    
    case actionTypes.SET_SHOW_RESOURCES:
      return { ...state, showResources: action.payload };
    
    case actionTypes.SET_MAIN_TOPIC:
      return { ...state, mainTopic: action.payload };
    
    case actionTypes.SET_RESOURCES:
      return {
        ...state,
        resources: { ...state.resources, ...action.payload }
      };
    
    case actionTypes.CLEAR_SELECTION:
      return {
        ...state,
        selectedTopic: null,
        showResources: false,
        resources: initialState.resources
      };
    
    case actionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const RoadmapContext = createContext();

// Context provider component
export const RoadmapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roadmapReducer, initialState);

  // Action creators (equivalent to Streamlit session state setters)
  const actions = {
    setLoading: (isLoading) => dispatch({ type: actionTypes.SET_LOADING, payload: isLoading }),
    
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    setRoadmapStructure: (roadmap, topic) => dispatch({
      type: actionTypes.SET_ROADMAP_STRUCTURE,
      payload: { roadmap, topic }
    }),
    
    setSelectedTopic: (topic) => dispatch({ type: actionTypes.SET_SELECTED_TOPIC, payload: topic }),
    
    setShowResources: (show) => dispatch({ type: actionTypes.SET_SHOW_RESOURCES, payload: show }),
    
    setResources: (resources) => dispatch({ type: actionTypes.SET_RESOURCES, payload: resources }),
    
    clearSelection: () => dispatch({ type: actionTypes.CLEAR_SELECTION }),
    
    resetState: () => dispatch({ type: actionTypes.RESET_STATE })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
};

// Custom hook to use roadmap context
export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

export default RoadmapContext;
