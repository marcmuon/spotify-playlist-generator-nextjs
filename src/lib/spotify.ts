import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API client with credentials and access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  accessToken: process.env.SPOTIFY_ACCESS_TOKEN,
});

export default spotifyApi;