// src/app/api/create-playlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import spotifyApi from '../../../lib/spotify';
import { CreatePlaylistResponse } from '../../../types/spotify'; // Import the interface

interface SoundParams {
  min_tempo?: number;
  max_tempo?: number;
  limit?: number;
}

interface CreatePlaylistBody {
  seed_tracks: string[];
  sound_params: SoundParams;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePlaylistBody = await request.json();
    const { seed_tracks, sound_params } = body;

    if (!seed_tracks || !Array.isArray(seed_tracks) || seed_tracks.length === 0) {
      return NextResponse.json({ error: 'Seed tracks are required.' }, { status: 400 });
    }

    // Fetch recommendations based on seed tracks and sound parameters
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: seed_tracks.slice(0, 5), // Spotify allows a maximum of 5 seed tracks
      limit: sound_params.limit || 100,
      min_tempo: sound_params.min_tempo,
      max_tempo: sound_params.max_tempo,
    });

    const recommendedTrackIds = recommendations.body.tracks.map(track => track.id);

    // Get user ID
    await spotifyApi.getMe();

    // Create a new playlist
    const playlist = await spotifyApi.createPlaylist(
        'Custom Playlist',
        {
          description: 'Playlist created via Next.js app',
          public: false,
        }
      );
      

    // Add tracks to the newly created playlist
    await spotifyApi.addTracksToPlaylist(
      playlist.body.id,
      recommendedTrackIds.map(id => `spotify:track:${id}`)
    );

    return NextResponse.json(
      { playlistUrl: playlist.body.external_urls.spotify } as CreatePlaylistResponse,
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating playlist:', error.message);
      return NextResponse.json({ error: 'Failed to create playlist.' }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'Failed to create playlist.' }, { status: 500 });
    }
  }
}
