const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Set up YouTube API client
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY // Make sure you have this key in your .env file      /* !!watch!!*/
  });

  // Endpoint to search for YouTube videos
  app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
      const response = await youtube.search.list({
        part: 'snippet',
        q: query,
        maxResults: 10,
        type: 'video'
      });

      const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId
      }));

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Important for MERN Setup: When our application runs from production, it functions slightly differently than in development
  // In development, we run two servers concurrently that work together
  // In production, our Node server runs and delivers our client-side bundle from the dist/ folder 
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  // Important for MERN Setup: Any client-side requests that begin with '/graphql' will be handled by our Apollo Server
  app.use('/graphql', expressMiddleware(server));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
