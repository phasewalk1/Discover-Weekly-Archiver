import React from "react";

const PostConnectionScreen = ({
  playlistSaved,
  onSave,
}: {
  playlistSaved: boolean;
  onSave: () => void;
}) => (
  <div className="post-connection-screen">
    <h2>Welcome to Spotsaver!</h2>
    <p>Your Spotify account has been connected successfully.</p>
    <p>Click the button below to archive your Discover Weekly playlist</p>
    {!playlistSaved ? (
      <button onClick={onSave} className="spotify-button">
        Save Discover Weekly
      </button>
    ) : (
      <p>Your Discover Weekly playlist has been saved!</p>
    )}
  </div>
);

export default PostConnectionScreen;
