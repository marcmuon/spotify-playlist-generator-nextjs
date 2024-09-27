// app/api/spotify/user/route.ts
import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API client with server-side environment variables
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  accessToken: process.env.SPOTIFY_ACCESS_TOKEN!,
});

export async function GET() {
  try {
    const userData = await spotifyApi.getMe();
    return NextResponse.json(userData.body);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data.' }, { status: 500 });
  }
}
