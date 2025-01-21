// Google OAuth credentials
const CLIENT_ID = "YOUR_CLIENT_ID"; // Replace with your Google API Client ID
const REDIRECT_URI = "https://<your-username>.github.io/<repo-name>/";
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;

const signinButton = document.getElementById("signin-button");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const channelNameSpan = document.getElementById("channel-name");

let channelName = "";
let token = "";

// Sign in with YouTube
signinButton.addEventListener("click", () => {
  window.location.href = AUTH_URL;
});

// Parse the token and fetch YouTube channel info
function getTokenFromUrl() {
  const hash = window.location.hash;
  if (hash) {
    const token = hash.split("&").find((param) => param.startsWith("#access_token"));
    return token ? token.split("=")[1] : null;
  }
  return null;
}

async function fetchChannelInfo() {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.items[0].snippet;
}

async function init() {
  token = getTokenFromUrl();
  if (token) {
    const channelInfo = await fetchChannelInfo();
    channelName = channelInfo.title;
    channelNameSpan.textContent = channelName;
    signinButton.style.display = "none";
    chatContainer.style.display = "block";
  }
}

// WebSocket connection
const socket = new WebSocket("wss://your-websocket-server-url"); // Replace with your WebSocket server URL

socket.onmessage = (event) => {
  const { sender, message } = JSON.parse(event.data);
  const p = document.createElement("p");
  p.textContent = `${sender}: ${message}`;
  chatBox.appendChild(p);
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(JSON.stringify({ sender: channelName, message }));
    const p = document.createElement("p");
    p.textContent = `You: ${message}`;
    p.style.color = "blue";
    chatBox.appendChild(p);
    messageInput.value = "";
  }
});

// Initialize the app
init();