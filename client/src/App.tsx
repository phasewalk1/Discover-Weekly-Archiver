import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import PlaylistDisplay from "./components/PlaylistDisplay";
import "./App.css";

function App() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistSaved, setPlaylistSaved] = useState(false);
  const [addedSongs, setAddedSongs] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    if (accessToken) {
      setSpotifyToken(accessToken);
      setIsAuthorized(true);
      window.history.pushState({}, "", "/");
    }
  }, []);

  const renderLandingPage = () => (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="app-title">Spotsaver</h1>
        <p className="tagline">
          Don't let your Discover Weekly gems disappear!
        </p>
        <button onClick={handleAuthRedirect} className="spotify-button">
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

  const handleAuthRedirect = () => {
    setIsConnecting(true);
    const authEndpoint = "http://localhost:8080/";
    window.location.href = authEndpoint;
  };

  const renderConnectingScreen = () => (
    <div className="connecting-screen">
      <h2>Connecting to Spotify...</h2>
      <div className="spinner"></div>
    </div>
  );

  const savePlaylist = () => {
    if (spotifyToken) {
      setIsLoading(true);
      axios
        .post(
          "http://localhost:8080/save-discover-weekly",
          {
            access_token: spotifyToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        .then((response) => {
          setAddedSongs(response.data.added_songs);
          setPlaylistSaved(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error saving playlist: ", error);
          setErrorMessage("Error saving playlist");
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="App">
      <div className="centered-container">
        {!isAuthorized ? (
          renderLandingPage()
        ) : isConnecting ? (
          renderConnectingScreen()
        ) : playlistSaved ? (
          <p>Your Discover Weekly playlist has been saved!</p>
        ) : (
          <>
            <button onClick={savePlaylist} className="spotify-button">
              Save Discover Weekly
            </button>
          </>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {playlistSaved && spotifyToken ? (
          <PlaylistDisplay songs={addedSongs} />
        ) : null}
      </div>
    </div>
  );
}

export default App;
