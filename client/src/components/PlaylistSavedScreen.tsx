import React from "react";
import PlaylistDisplay from "./PlaylistDisplay";
import { Song } from "./PlaylistDisplay";

const PlaylistSavedScreen = ({ songs }: { songs: Song[] }) => (
  <div className="playlist-saved-screen">
    <h2>Your Discover Weekly playlist has been archived in 'Saved Weekly'!</h2>
    <p>Check out the tracks below:</p>
    <PlaylistDisplay songs={songs} />
  </div>
);

export default PlaylistSavedScreen;
