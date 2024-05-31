import axios from 'axios';

const YOUTUBE = 'https://www.googleapis.com/youtube/v3/search';

export async function getVideos(searchTerm) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  try {
    const response = await axios.get(YOUTUBE, {
      params: {
        part: 'snippet',
        q: 'How to ' + searchTerm,
        type: 'video',
        maxResults: 12,
        key: apiKey,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
    if (error.response && error.response.status === 403) {
      console.error('Access to YouTube API forbidden. Check your API key and permissions.');
    }
    throw error;
  }
}