<div align="center">
    <h1>Deep Cut</h1>
    <a href="https://www.youtube.com/watch?v=O_uq5xVVgW0">Live Demo</a>
</div>

## About

Deep Cut is a music listening journal that lets you track every album you listen to, rate individual tracks in real time, and write long-form thoughts about your listening experience. Search any album via the iTunes Search API, start a listening session, check off tracks as you go, and build a personal archive of every listen.

**Features:**

- Search albums and artists via the iTunes Search API
- Bookmark albums and songs to a personal listen list
- Start listening sessions — check off tracks and rate them live
- Write an overall album review with full Markdown support
- Browse your journal with filters by media type, status, and sort order

## Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Supabase](https://supabase.com/)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)

## Dependencies

| Package                 | Purpose                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `@supabase/supabase-js` | Auth and database                                                                             |
| `react-router`          | Routing                                                                                       |
| `react-markdown`        | Renders user-written Markdown in journal entries                                              |
| `remark-gfm`            | Remark plugin to support GFM (autolink literals, footnotes, strikethrough, tables, tasklists) |

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/EmmanuelCobian/deep_cut.git
   cd deep-cut
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Set up environment variables by making a copy of the example file

   ```sh
   cp .env.local.example .env.local
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

## API Connection

This app uses the iTunes Search API for all music data (album search, artist discographies, track listings). This API is public and requires no API key or authentication.

Example request:

```
https://itunes.apple.com/search?term=frank+ocean&media=music&entity=album&limit=15
```

## Supabase Setup

This app uses [Supabase](https://supabase.com/) for user authentication (magic link / passwordless) and data persistence. The hosted Supabase project is already live. You can run the app using the credentials provided in `.env.local.example` without any additional setup.
