# Testing Guide

## Quick Start

### Option 1: Full Build and Run (Recommended for Testing)

1. **Build both frontend and backend:**
   ```bash
   npm run build-all
   ```

2. **Start the server:**
   ```bash
   npm run start-server
   ```
   The server will run on `http://localhost:3000`

3. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Option 2: Development Mode (with auto-reload)

1. **Terminal 1 - Build and start server:**
   ```bash
   npm run build-back
   npm run start-server
   ```

2. **Terminal 2 - Build and serve frontend (with hot reload):**
   ```bash
   npm run build-front-serve
   ```
   Frontend will be available at `http://localhost:9001`

   **Note:** For this setup, you need to configure the socket.io client to connect to `http://localhost:3000` in `mainScene.ts`

### Option 3: Using the dev script
```bash
npm run dev
```
This builds everything and starts the server.

## Troubleshooting

### If you get "Cannot find module" errors:
```bash
npm install
```

### If the server doesn't start:
- Make sure port 3000 is not already in use
- Check that `built-server/bundle-back.js` exists (run `npm run build-back` first)

### If socket connection fails:
- Make sure the server is running on port 3000
- Check browser console for connection errors
- Verify both frontend and backend are built

### For Node version compatibility issues:
```bash
npm config set legacy-peer-deps true
```

## Game Controls

- **W, A, S, D** - Move player
- **Mouse** - Rotate player
- **Left Click** - Shoot bullet

## Testing Multiplayer

1. Open the game in multiple browser tabs/windows
2. Each tab represents a different player
3. You should see other players moving in real-time
4. Test shooting and collision detection
