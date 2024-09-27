'use client';

import { useEffect, useState } from 'react';
import PlaylistCreator from '../components/PlaylistCreator';

interface SpotifyUser {
  display_name: string;
  images: { url: string }[];
  // Add other fields as needed
}

export default function Home() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/spotify/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: SpotifyUser = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold my-8">Spotify Playlist Creator</h1>
      {user && (
        <div className="mb-6 flex items-center space-x-4">
          {user.images && user.images.length > 0 && (
            <img src={user.images[0].url} alt="User Avatar" className="w-16 h-16 rounded-full" />
          )}
          <p className="text-lg">Logged in as {user.display_name}</p>
        </div>
      )}
      <PlaylistCreator />
    </div>
  );
}
