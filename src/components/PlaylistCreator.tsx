'use client';

import { useState } from 'react';
import axios from 'axios';
import { CreatePlaylistResponse } from '../types/spotify';

const PlaylistCreator = () => {
  const [seedTracks, setSeedTracks] = useState<string>('');
  const [minTempo, setMinTempo] = useState<number>(120);
  const [maxTempo, setMaxTempo] = useState<number>(150);
  const [limit, setLimit] = useState<number>(100);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreatePlaylist = async () => {
    setLoading(true);
    setError(null);
    setPlaylistUrl(null);

    // Split seed track IDs by comma and trim whitespace
    const seedTrackIds = seedTracks.split(',').map(id => id.trim()).filter(id => id !== '');

    if (seedTrackIds.length === 0) {
      setError('Please enter at least one valid Spotify track ID.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<CreatePlaylistResponse>('/api/create-playlist', {
        seed_tracks: seedTrackIds,
        sound_params: {
          minTempo,
          maxTempo,
          limit,
        },
      });

      setPlaylistUrl(response.data.playlistUrl);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to create playlist.');
      } else {
        setError('Failed to create playlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create a Custom Playlist</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Seed Track IDs (comma separated)</label>
        <input
          type="text"
          value={seedTracks}
          onChange={e => setSeedTracks(e.target.value)}
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g., 1VDSRIJVZarKOl46orL5uZ, 1HcmupZK2O8yPvjijkas3G"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Minimum Tempo</label>
        <input
          type="number"
          value={minTempo}
          onChange={e => setMinTempo(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g., 120"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Maximum Tempo</label>
        <input
          type="number"
          value={maxTempo}
          onChange={e => setMaxTempo(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g., 150"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Number of Tracks</label>
        <input
          type="number"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded mt-1"
          placeholder="e.g., 100"
        />
      </div>

      <button
        onClick={handleCreatePlaylist}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Creating Playlist...' : 'Create Playlist'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {playlistUrl && (
        <div className="mt-4">
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 underline">
            Your playlist has been created! Click here to view it on Spotify.
          </a>
          <div className="mt-4">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${extractPlaylistId(playlistUrl)}`}
              width="100%"
              height="380"
              frameBorder="0"
              allow="encrypted-media"
              title="Spotify Playlist Player"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to extract playlist ID from URL
const extractPlaylistId = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split('/');
    const playlistIndex = segments.findIndex(segment => segment === 'playlist');
    if (playlistIndex !== -1 && segments.length > playlistIndex + 1) {
      return segments[playlistIndex + 1].split('?')[0];
    }
    return '';
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
};

export default PlaylistCreator;
