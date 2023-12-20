import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import PlaylistDisplay from "./components/PlaylistDisplay";

function App() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
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

  const handleAuthRedirect = () => {
    const authEndpoint = "http://localhost:8080/";
    window.location.href = authEndpoint;
  };

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
        <h1>capsule.music</h1>
        {!isAuthorized ? (
          <button onClick={handleAuthRedirect} className="spotify-button">
            Connect to Spotify
          </button>
        ) : isLoading ? (
          <p>Loading...</p>
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
