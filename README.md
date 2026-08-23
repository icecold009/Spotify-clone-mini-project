# NextSound

NextSound is a music-discovery interface for browsing tracks, albums, artists, and playlists. It can run immediately in demo mode with curated data, or connect to Spotify through a small Express server that keeps browser requests on the safe side of the API boundary.

The project is built around the feeling of moving through music: a visual hero, quick search, a browseable catalogue, and a persistent player that stays available while the rest of the page changes.

## Highlights

- Demo mode with curated chart-topping tracks and real artwork.
- Optional Spotify catalogue search across tracks, albums, artists, and playlists.
- Command palette with `⌘K` / `Ctrl+K` access and keyboard navigation.
- Recent searches and recommendation-oriented result grouping.
- Mini player with play/pause, skip, seek, volume, queue, shuffle, and repeat.
- Favourite tracks and a collapsible player for smaller screens.
- Responsive desktop, tablet, and mobile layouts.
- Dark/light theme persistence, skeleton loading, and user-facing error states.
- Redux Toolkit Query caching for efficient data fetching.

## Screenshots

### Hero

![NextSound hero](src/assets/images/hero.png)

### Browse view

![NextSound browse view](src/assets/images/all-songs.png)

## Run in demo mode

You need Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. Demo mode does not require Spotify credentials and is the quickest way to explore the interface.

## Connect Spotify

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/).
2. Create a `.env` file in the repository root.
3. Add the credentials used by the local server:

   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

4. Run the client and Express proxy together:

   ```bash
   npm run dev:full
   ```

The client runs on port `5173` and the local server defaults to port `3001`. Never expose the Spotify client secret to browser code or commit the `.env` file.

## Build and test

```bash
npm run build
npm run preview
npm test
npm run test:coverage
```

## Technology

- React 18, TypeScript, and Vite
- Redux Toolkit and RTK Query
- React Router
- Framer Motion and Swiper
- Express server for API proxying
- Spotify Web API
- Vitest and Playwright-oriented test tooling

## Repository map

```text
src/                    React application and music experience
server/                 Express API proxy
src/assets/images/      README and interface imagery
```

## Troubleshooting

- If live requests fail with CORS errors, run `npm run dev:full` so the Express proxy is available.
- If the app shows no live data, check the `.env` variable names and restart the dev server.
- If ports are occupied, move the Vite or Express port in the local configuration rather than exposing credentials directly to the browser.

NextSound is a discovery experience, not a replacement for Spotify. Spotify data, images, and API usage remain subject to Spotify’s current developer terms.
