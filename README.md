<div align="center" >
  <br/>
  <br/>
  <img src="/src/assets/svg/nextsound.svg" alt="NextSound logo" width="80" height="auto" />
  <h1>NextSound</h1>
  <br/>

  <p >
A music discovery app built with React and TypeScript. <br/> Browse tracks, albums, and artists using Spotify's API.
  </p>
</div>

<br/>
<br/>

## How it works

NextSound runs in two modes depending on your setup:

### Demo mode (no API needed)
Without API credentials:
- Curated collection of 2024-2025 chart toppers
- Works immediately after `git clone` and `npm install`
- Real album artwork and track metadata
- Features artists like Billie Eilish, Harry Styles, Morgan Wallen, and more

Benefits:
- Perfect for trying out the app quickly
- No API setup required
- Images load from Spotify CDN
- Shows off the full UI

<br/>


### With Spotify API (recommended)
If you have Spotify API credentials:
- Real-time access to Spotify's music catalog
- Search across millions of tracks, albums, and artists
- Latest trending songs and new releases
- All features available

Requires:
- Spotify API credentials in `.env` file
- Backend server running for CORS handling

<br/>


The app automatically detects which mode to use.

<br/>

## Features

### 🎵 Music Discovery
- **Hero Section**: Auto-playing slideshow featuring latest trending tracks with full-screen backgrounds
- **Latest Hits**: Browse the newest releases and popular tracks
- **Track Cards**: Interactive cards with album artwork, artist info, and quick actions
- **Browse by Category**: Explore tracks organized by different music genres and moods

### 🔍 Search & Command Palette
- **Command Palette** (⌘K / Ctrl+K): Quick access search interface
- **Universal Search**: Search across tracks, albums, artists, and playlists
- **Keyboard Navigation**: Full keyboard support with arrow keys and shortcuts
- **Recent Searches**: Quick access to recently viewed items
- **Smart Recommendations**: Intelligent search results with exact matches and recommendations

### 🎧 Audio Player
- **Mini Player**: Fixed bottom player bar with full playback controls
- **Playback Controls**: Play/pause, skip next/previous, seek, and volume control
- **Queue Management**: Add tracks to queue, reorder, remove, and manage your playlist
- **Shuffle & Repeat**: Shuffle mode and repeat options (off, one, all)
- **Progress Tracking**: Visual progress bar with click-to-seek functionality
- **Minimize/Maximize**: Collapsible player for minimal screen footprint
- **Favorite Tracks**: Heart/favorite tracks for quick access

### 🎨 User Interface
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preferences
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for fluid transitions and interactions
- **Sidebar Navigation**: Collapsible sidebar for easy navigation on mobile devices
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Error Handling**: Graceful error boundaries and user-friendly error messages

### 🚀 Performance & Technology
- **Demo Mode**: Works immediately without API setup using curated mock data
- **Spotify API Integration**: Full integration with Spotify Web API for live data
- **Offline Caching**: Intelligent caching for offline access and faster loading
- **RTK Query**: Efficient data fetching and caching with Redux Toolkit Query
- **Type Safety**: Full TypeScript support for better development experience

<br/>

## :camera: Screenshots

### Hero Section 
<kbd><img width="800" alt="NextSound Hero Section and Track Grid" src="./src/assets/images/hero.png"></kbd>

<br/>

### Homepage
<kbd><img width="800" alt="NextSound Homepage with Music Content" src="./src/assets/images/all-songs.png"></kbd>


<br/>
<br/>

## Getting started

You need Node.js 18+ and npm.

```bash
# Clone and install
git clone https://github.com/natashaongiscoding/music-app.git
cd music-app  # or cd nextsound (depending on your repository name)
npm install

# Start the app
npm run dev
```

Open `http://localhost:5173` - the app works immediately with demo data.

<br>

### Want live Spotify data?

1. Create a [Spotify Developer Account](https://developer.spotify.com/) and create a new app
2. Get your Client ID and Client Secret from the app dashboard
3. Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```
4. Start with the backend:
   ```bash
   npm run dev:full
   ```

<br/>

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

<br/>

## Build

```bash
npm run build
npm run preview
```

<br/>

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **State:** Redux Toolkit with RTK Query
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Backend:** Node.js, Express.js (CORS proxy)
- **API:** Spotify Web API
- **Testing:** Vitest, Playwright

<br>

## Troubleshooting

### Common Issues

**CORS Errors with Spotify API**
- **Problem:** API requests fail due to CORS restrictions
- **Solution:** Ensure the backend server is running (`npm run dev:full` or `npm run server:dev`)
- **Details:** Spotify Web API cannot be called directly from browsers due to CORS policy

**Missing Environment Variables**
- **Problem:** App shows "No music data available" or API errors
- **Solution:** Check that `.env` file exists with valid Spotify credentials (Client ID and Client Secret)
- **How to get credentials:** Create a [Spotify Developer Account](https://developer.spotify.com/), create a new app, and get your Client ID and Client Secret from the app dashboard

**Port Conflicts**
- **Frontend (Port 5173):** Check if another Vite/dev server is running
- **Backend (Port 3001):** Check if another Express server is using the port
- **Solution:** Kill existing processes or modify port configuration

**Build/TypeScript Errors**
- **Problem:** TypeScript compilation errors during build
- **Solution:** Run `npm run build` to see specific error details
- **Common fix:** Ensure all dependencies are installed (`npm install`)

<br/>

### Getting Help
- For Spotify API setup: Create a [Spotify Developer Account](https://developer.spotify.com/) and follow their documentation
- [Reach out to the NextWork community to ask your question!](https://community.nextwork.org/c/i-have-a-question/)

---

<div align="center">
  <p>Built with ❤️ for music lovers everywhere</p>
  <p>Discover your next favorite track with NextSound</p>
</div>
