import React from "react";
import { FaSpotify } from "react-icons/fa";

const LandingPage = ({ onConnect }: { onConnect: () => void }) => (
  <div className="landing-page">
    <div className="hero-section">
      <h1 className="app-title">Spotsaver</h1>
      <p className="tagline">Don't let your Discover Weekly gems disappear!</p>
      <button onClick={onConnect} className="spotify-button">
        <FaSpotify /> Connect to Spotify
      </button>
    </div>
    <div className="feature-section">
      <div className="feature-item">
        {/* Insert icons or images for each feature */}
        <h3>Save Forever</h3>
        <p>Automatically archive your Discover Weekly playlists.</p>
      </div>
      <div className="feature-item">
        <h3>Instant Previews</h3>
        <p>
          Jump right into your newly saved tracks with an integrated playlist
          viewer.
        </p>
      </div>
      {/* Add more features as needed */}
    </div>
  </div>
);

export default LandingPage;
