const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate roadmap structure - converted from Python function
router.post('/generate-roadmap', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
    You are an expert tutor for the Indian Joint Entrance Examination (JEE).
    Create a comprehensive, hierarchical learning roadmap for the JEE topic: '${topic}'.
    The structure must be a nested JSON object. Values can be a list of strings, or a list containing strings and other nested objects.

    Example for 'Calculus':
    {
        "Limits, Continuity & Differentiability": [
            "Limits of Functions",
            "Continuity", 
            "Differentiability",
            {"Mean Value Theorems": ["Rolle's Theorem", "Lagrange's MVT"]}
        ],
        "Applications of Derivatives": [
            "Rate of Change",
            "Tangents and Normals", 
            "Maxima and Minima"
        ]
    }
    
    Create a detailed roadmap for '${topic}' following this exact nested structure.
    Return ONLY the valid JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (similar to Python regex)
    const jsonMatch = text.match(/\{.*\}/s);
    
    if (jsonMatch) {
      try {
        const roadmapStructure = JSON.parse(jsonMatch[0]);
        res.json({ 
          success: true, 
          roadmap: roadmapStructure,
          topic: topic
        });
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        res.status(500).json({ 
          error: 'Failed to parse AI response',
          rawResponse: text
        });
      }
    } else {
      res.status(500).json({ 
        error: 'No valid JSON found in AI response',
        rawResponse: text
      });
    }

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    });
  }
});

// Generate study notes - converted from Python function
router.post('/generate-notes', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
    You are an expert tutor for the Indian Joint Entrance Examination (JEE).
    Create a comprehensive set of study notes for a beginner learning the JEE topic: '${topic}'.
    Include Key Formulas, Core Concepts, Problem-Solving Tips, and a Summary.
    Format the output using clear headings and markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const notes = response.text();

    res.json({
      success: true,
      notes: notes,
      topic: topic,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Notes Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate notes',
      message: error.message
    });
  }
});

module.exports = router;
