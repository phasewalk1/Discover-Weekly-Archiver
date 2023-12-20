import React, { useEffect, useState } from "react";

interface Song {
  title: string;
  artist: string;
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
        <div key={index} className="song">
          <p>
            {song.title} by {song.artist}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PlaylistDisplay;
