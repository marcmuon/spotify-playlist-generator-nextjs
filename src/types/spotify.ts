export interface SpotifyImage {
    url: string;
  }
  
  export interface SpotifyUser {
    display_name: string;
    images: SpotifyImage[];
  }
  
  export interface CreatePlaylistResponse {
    playlistUrl: string;
  }
  