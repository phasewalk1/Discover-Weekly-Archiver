import axios from "axios";
import React, { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import ConnectingScreen from "./components/ConnectingScreen";
import PostConnectionScreen from "./components/PostConnectionScreen";
import PlaylistSavedScreen from "./components/PlaylistSavedScreen";
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

  const handleAuthRedirect = () => {
    setIsConnecting(true);
    const authEndpoint = "http://localhost:8080/";
    window.location.href = authEndpoint;
  };

  const savePlaylist = () => {
    if (spotifyToken && !playlistSaved) {
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
        {!isAuthorized && !isConnecting ? (
          <LandingPage onConnect={handleAuthRedirect} />
        ) : isConnecting ? (
          <ConnectingScreen />
        ) : isLoading ? (
          <p>Loading...</p>
        ) : playlistSaved ? (
          <PlaylistSavedScreen songs={addedSongs} />
        ) : (
          <PostConnectionScreen
            onSave={savePlaylist}
            playlistSaved={playlistSaved}
          />
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
