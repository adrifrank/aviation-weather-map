# Aviation Weather Map

A React application that displays real-time aviation weather warnings (SIGMET/AIRSIGMET) on an interactive map with advanced filtering capabilities. This project features a modern frontend built with TypeScript and Vite, and a backend proxy server with in-memory caching to handle API requests.

## Features

- **Interactive Map:** Smooth, zoomable map powered by MapLibre GL JS.
- **Real-Time Data:** Displays up-to-date SIGMET and AIRSIGMET data from the Aviation Weather Center (AWC) API.
- **Detailed Popups:** Click on any weather advisory to see detailed information, including hazard type, altitude, valid time, and raw text.
- **Advanced Filtering:**
  - Toggle visibility for SIGMET and AIRSIGMET layers.
  - Filter advisories by a specific altitude range using a slider.
- **Backend Proxy with Caching:** A lightweight Express.js server proxies API requests to avoid CORS issues and caches responses for 1 hour to improve performance.
- **Clean Architecture:** The codebase is well-structured with a clear separation of concerns, using custom React hooks, utility functions, and a typed codebase with TypeScript.
- **Unit Tested:** Key components and logic are covered by unit tests using Jest and React Testing Library.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, MapLibre GL JS, Material-UI (MUI), Axios
- **Backend:** Node.js, Express.js, TypeScript
- **Testing:** Jest, React Testing Library

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- npm (or yarn/pnpm)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/adrifrank/aviation-weather-map.git
    cd aviation-weather-map
    ```

2.  **Install all dependencies:**
    This single command will install dependencies for both the client and the server.

    ```bash
    npm run install:all
    ```

3.  **Set up Environment Variables:**
    The application requires an API key from MapTiler to display the map tiles.
    - Go to [MapTiler Cloud](https://www.maptiler.com/cloud/) and create a free account.
    - Find your API key in your account dashboard.
    - In the root of the project, create a new file named `.env.local` by copying the example file:
      ```bash
      cp .env.example .env.local
      ```
    - Open the newly created `.env.local` file and paste your API key:

      ```
      VITE_MAPTILER_API_KEY="YOUR_MAPTILER_API_KEY_HERE"

      ```

### Running the Application

#### Development Mode

To run in development mode, open **two separate terminals**:

1. Backend Server

```bash
npm run dev:server
```

You should see: `Proxy server is running on port 3001`

2. Frontend Client

```bash
npm run dev:client
```

Application will be available at: `http://localhost:5173`

> **Note:** Both terminals must remain open during development.

#### Production Mode

```bash
npm run build    # Build the project
npm run start    # Start the server
```

## All available Scripts

- `npm run dev:client`: Starts the development server for client and server.
- `npm run dev:server`: Starts the development server for server.
- `npm run build`: Creates an optimized production build for both client and server.
- `npm run start`: Runs the production server (after building).
- `npm test`: Runs all unit tests for the frontend application.
- `npm run lint`: Lints the frontend codebase.
