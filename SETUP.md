# Setup Instructions

## CORS Error Fix

This app now uses a backend proxy server to avoid CORS errors when calling the Anthropic API. The API key is kept secure on the server side.

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```bash
# Anthropic API Key
# Get your API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_api_key_here

# Server Port (optional, defaults to 3001)
PORT=3001
```

**Important:** Replace `your_api_key_here` with your actual Anthropic API key.

### 3. Run the Application

You have two options:

#### Option A: Run Both Server and Frontend Together (Recommended)
```bash
npm run dev
```
This will start both the backend server (port 3001) and the React app (port 3000) simultaneously.

#### Option B: Run Separately

Terminal 1 - Start the backend server:
```bash
npm run server
```

Terminal 2 - Start the React app:
```bash
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## How It Works

1. When you upload an image, the frontend sends it to the backend server (`http://localhost:3001/api/extract-image`)
2. The backend server makes the request to Anthropic API with your API key
3. The backend returns the response to the frontend
4. The frontend extracts event details from the response

This approach:
- ✅ Prevents CORS errors
- ✅ Keeps your API key secure (never exposed to the browser)
- ✅ Allows you to add authentication, rate limiting, and other security measures later

## Troubleshooting

### "Anthropic API key not configured" error
- Make sure you created a `.env` file in the root directory
- Make sure the `ANTHROPIC_API_KEY` variable is set correctly
- Restart the server after creating/updating the `.env` file

### Connection refused errors
- Make sure the backend server is running on port 3001
- Check that port 3001 is not being used by another application

### CORS errors still appearing
- Make sure you're using the backend proxy (calling `http://localhost:3001/api/extract-image`)
- Make sure the backend server is running

