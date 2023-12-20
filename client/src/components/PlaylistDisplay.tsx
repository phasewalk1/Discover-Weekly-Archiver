import React, { useEffect, useState } from "react";

export interface Song {
  title: string;
  artist: string;
  album_artwork: string;
  track_uri: string;
}

interface PlaylistDisplayProps {
  songs: Song[];
}

const PlaylistDisplay = ({ songs }: PlaylistDisplayProps) => {
  if (!Array.isArray(songs)) {
    console.error("songs is not an array", songs);
    return null;
  }

  return (
    <div className="playlist-display">
      {songs.map((song, index) => (
        <a
          href={`https://open.spotify.com/track/${extractSpotifyId(
            song.track_uri,
          )}`}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="card"
        >
          <div className="card-image">
            <img
              src={song.album_artwork}
              alt={`${song.title} album cover`}
              className="album-artwork"
            />
          </div>
          <div className="card-content">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

function extractSpotifyId(uri: string): string {
  return uri.split(":")[2];
}

export default PlaylistDisplay;
