import os
import secrets
import time
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect, jsonify
from flask_cors import CORS


# initialize Flask app
app = Flask(__name__)
app.config["SESSION_COOKIE_NAME"] = "spotify-login-session"
app.secret_key = secrets.token_urlsafe(16)
# enable CORS
CORS(app, supports_credentials=True)


# login route: redirects to Spotify login page
@app.route("/")
def login():
    # get the auth url from Spotify
    auth_url = create_spotify_oauth().get_authorize_url()
    # redirect to auth url
    return redirect(auth_url)


# callback route: redirects to frontend with access token
@app.route("/spotify-callback")
def spotify_callback():
    session.clear()
    code = request.args.get("code")
    token_info = create_spotify_oauth().get_access_token(code)
    session["token_info"] = token_info
    access_token = token_info["access_token"]
    refresh_token = token_info["refresh_token"]
    expires_in = token_info["expires_in"]
    frontend_url = "https://spotsaver.vercel.app/callback"
    callback_uri = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}&expires_in={expires_in}"
    return redirect(callback_uri)


# save discover weekly tracks to saved weekly playlist
@app.route("/save-discover-weekly", methods=["POST"])
def save_discover_weekly():
    print("Request headers:", request.headers)
    print("Reqeust origin:", request.origin)

    access_token = request.json.get("access_token")
    if not access_token:
        return jsonify({"error": "Access token is required"}), 400

    sp = spotipy.Spotify(auth=access_token)
    user_id = sp.current_user()["id"]

    playlist_pages = sp.current_user_playlists(limit=50)
    discover_weekly_id = None
    saved_weekly_id = None

    while playlist_pages:
        for playlist in playlist_pages["items"]:
            if playlist["name"] == "Discover Weekly":
                discover_weekly_id = playlist["id"]
            if playlist["name"] == "Saved Weekly":
                saved_weekly_id = playlist["id"]
        if discover_weekly_id:
            break
        if playlist_pages["next"]:
            playlist_pages = sp.next(playlist_pages)
        else:
            break

    if not discover_weekly_id:
        return "Discover Weekly playlist not found!"
    if not saved_weekly_id:
        saved_weekly = sp.user_playlist_create(user_id, "Saved Weekly", True)
        saved_weekly_id = saved_weekly["id"]

    discover_weekly_items = sp.playlist_items(discover_weekly_id)["items"]
    saved_weekly_items = sp.playlist_items(saved_weekly_id)["items"]
    saved_weekly_uris = set(item["track"]["uri"] for item in saved_weekly_items)

    tracks_to_add = []
    for item in discover_weekly_items:
        uri = item["track"]["uri"]
        if uri not in saved_weekly_uris:
            tracks_to_add.append(uri)

    if tracks_to_add:
        sp.user_playlist_add_tracks(user_id, saved_weekly_id, tracks_to_add)

    added_songs = [
        {
            "title": item["track"]["name"],
            "artist": item["track"]["artists"][0]["name"],
            "album_artwork": item["track"]["album"]["images"][0]["url"],
            "track_uri": item["track"]["uri"],
        }
        for item in discover_weekly_items
    ]

    app.logger.debug(added_songs)
    print(added_songs)

    return jsonify({"added_songs": added_songs})


def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=url_for("spotify_callback", _external=True),
        scope="user-library-read playlist-read-private playlist-modify-public playlist-modify-private",
    )


def token_from_session():
    token_info = session.get("token_info", None)
    if not token_info:
        return redirect(url_for("login", _external=False))
    else:
        now = int(time.time())
        is_expired = token_info["expires_at"] - now < 60
        if is_expired:
            sp_oauth = create_spotify_oauth()
            token_info = sp_oauth.refresh_access_token(token_info["refresh_token"])
        return token_info
