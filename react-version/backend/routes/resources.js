const express = require('express');
const { google } = require('googleapis');
const PDFDocument = require('pdfkit');
const router = express.Router();

// Initialize YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Initialize Custom Search API
const customsearch = google.customsearch({
  version: 'v1',
  auth: process.env.YOUTUBE_API_KEY
});

// Get YouTube video - converted from Python function
router.get('/youtube/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchResponse = await youtube.search.list({
      q: `${query} JEE tutorial`,
      part: 'snippet',
      maxResults: 1,
      type: 'video',
      order: 'viewCount'
    });

    if (searchResponse.data.items && searchResponse.data.items.length > 0) {
      const video = searchResponse.data.items[0];
      const videoId = video.id.videoId;
      const videoTitle = video.snippet.title;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const thumbnailUrl = video.snippet.thumbnails.medium?.url;

      res.json({
        success: true,
        video: {
          title: videoTitle,
          url: videoUrl,
          videoId: videoId,
          thumbnail: thumbnailUrl,
          description: video.snippet.description
        }
      });
    } else {
      res.json({
        success: false,
        message: 'No video found',
        video: null
      });
    }

  } catch (error) {
    console.error('YouTube API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch YouTube video',
      message: error.message
    });
  }
});

// Get online articles - converted from Python function
router.get('/articles/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || !process.env.SEARCH_ENGINE_ID) {
      return res.status(400).json({ 
        error: 'Query and Search Engine ID are required' 
      });
    }

    const searchResponse = await customsearch.cse.list({
      q: `${query} JEE study material article`,
      cx: process.env.SEARCH_ENGINE_ID,
      num: 3
    });

    if (searchResponse.data.items) {
      const articles = searchResponse.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink
      }));

      res.json({
        success: true,
        articles: articles
      });
    } else {
      res.json({
        success: true,
        articles: []
      });
    }

  } catch (error) {
    console.error('Custom Search API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error.message
    });
  }
});

// Generate PDF notes - converted from Python function
router.post('/generate-pdf', async (req, res) => {
  try {
    const { notes, topic } = req.body;
    
    if (!notes || !topic) {
      return res.status(400).json({ error: 'Notes and topic are required' });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 72 });
    
    // Set response headers for PDF download
    const safeTopicName = topic.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTopicName}_JEE_notes_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title and header
    doc.fontSize(24)
       .fillColor('#1f77b4')
       .text(`JEE Study Notes: ${topic}`, { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(12)
       .fillColor('black')
       .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    doc.moveDown(1);

    // Process notes content
    const lines = notes.split('\n');
    
    lines.forEach(line => {
      if (line.trim()) {
        const cleanLine = line.replace(/\*\*/g, '').trim();
        
        // Check if it's a heading (short line ending with : or starting with numbers)
        if (cleanLine.length < 60 && (cleanLine.endsWith(':') || /^\d+\./.test(cleanLine))) {
          doc.fontSize(14)
             .fillColor('#2ca02c')
             .text(cleanLine, { continued: false });
          doc.moveDown(0.3);
        } else {
          doc.fontSize(11)
             .fillColor('black')
             .text(cleanLine, { align: 'justify' });
          doc.moveDown(0.2);
        }
      }
    });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

module.exports = router;
