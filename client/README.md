# Client — Real-time vehicle tracking UI

This folder contains the **React (Vite) single-page app** for the assignment: a live map of a vehicle, telemetry-driven stats, and a WebSocket link to the backend simulator.

---

## What this is

A browser client that **subscribes to one vehicle by license plate**, receives **streaming GPS-style updates** (lat, lng, heading, speed, status, timestamp), and renders:

- A **Mapbox** map with a **route trail** whose **last segment** eases with the vehicle (same timing as the marker), plus a **soft glow** under the line  
- A **last-location marker** that **animates** between socket points (`useAnimatedLatLng`) and shows **pulsing rings** in CSS so the current position reads clearly  
- A **stats panel** (shown after tapping the marker) with speed, fuel placeholder, and trip distance  

State is held in **Redux**; realtime data arrives over **Socket.IO**.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|--------|
| Language | **TypeScript** | Strict typing for API payloads, Redux, and map types. |
| UI | **React 18** | Function components; feature + presentational split. |
| Build / dev | **Vite 5** | Fast HMR; `@/` → `src/` alias in `vite.config.ts`. |
| State | **Redux Toolkit** + **react-redux** | Single store; `vehicle` slice for live stats and history. |
| Maps | **mapbox-gl** + **react-map-gl** (Mapbox entry) | Basemap, GeoJSON route, `Marker`, camera APIs. |
| Realtime | **socket.io-client** | Matches Nest/Socket.IO backend; subscribe by plate. |
| Styling | **Sass** + **CSS modules** (`.module.scss`) | Scoped component styles; shared tokens in `theme/`. |
| Lint | **ESLint 9** + **typescript-eslint** | `npm run lint`. |

Dev dependencies include **@vitejs/plugin-react**, **@types/** packages, and **sass** for SCSS compilation.

---

## Folder structure

Overview of the `client/` app (omit `node_modules/` and build output `dist/`).

```text
client/
├── index.html                 # Vite HTML entry
├── vite.config.ts             # React plugin, path alias @ → src
├── eslint.config.js
├── package.json
├── README.md
└── src/
    ├── main.tsx               # createRoot, Redux Provider, global.scss
    ├── App.tsx                # Root layout
    ├── App.module.scss
    ├── vite-env.d.ts
    ├── assets/                # SVG icons, markers, etc.
    ├── api/
    │   ├── index.ts           # Re-exports vehicle API
    │   └── vehicle/
    │       ├── index.ts
    │       ├── vehicle.types.ts
    │       ├── vehicle.constant.ts   # Socket event names
    │       ├── vehicle.socket.ts     # Socket.IO singleton + subscribe helpers
    │       └── vehicel.api.ts        # Optional HTTP helpers (e.g. geocoding)
    ├── components/
    │   ├── Map/               # Map.tsx, useMap.ts, styles, barrel index
    │   └── Stats/             # Stats panel + styles
    ├── feature/
    │   └── vehicleTracking/   # VehicleTracking screen + useVehicleTracking hook
    ├── hooks/
    │   ├── useVehicleSocket.ts
    │   ├── useAnimatedLatLng.ts
    │   └── useRedux.ts
    ├── store/
    │   ├── index.ts           # configureStore
    │   └── slices/
    │       └── vehicleSlice.ts
    ├── theme/
    │   ├── global.scss
    │   └── colors.scss
    └── utils/
        ├── distance.ts
        └── vehicleMetrics.ts
```

Path alias: `@/` → `src/` (see `vite.config.ts`).

---

## Why it is built this way

| Concern | Approach |
|--------|----------|
| Frequent position updates | Socket.IO matches the backend’s push model; no polling. |
| Shared UI + map | Redux keeps a single source of truth for history, totals, and latest stats. |
| Map + performance | `react-map-gl` wraps Mapbox GL; route is a GeoJSON `LineString` source. |
| Readable structure | Feature folder for the main screen, thin API layer for sockets/HTTP helpers. |

---

## Where things live

| Area | Path | Role |
|------|------|------|
| Entry | `src/main.tsx` | Redux `Provider`, global styles. |
| Root UI | `src/App.tsx` | Shell; mounts the vehicle-tracking feature. |
| Feature | `src/feature/vehicleTracking/` | Composes map + stats; wires socket → Redux; demo plate constant. |
| Map | `src/components/Map/` | Mapbox map, GeoJSON route (animated last segment + glow), pulsing marker, camera follow (`useMap`). |
| Stats | `src/components/Stats/` | Overlay card when the marker is clicked. |
| Realtime API | `src/api/vehicle/vehicle.socket.ts` | Singleton Socket.IO client, subscribe/unsubscribe, event names. |
| Types & REST helper | `src/api/vehicle/vehicle.types.ts`, `vehicel.api.ts` | Payload shapes; optional Mapbox Geocoding helper. |
| State | `src/store/slices/vehicleSlice.ts` | Vehicle plate, latest stats, path history, derived distance & average speed. |
| Metrics | `src/utils/vehicleMetrics.ts`, `distance.ts` | Haversine segments, rolling trip distance and average speed. |
| Hooks | `src/hooks/` | `useVehicleSocket`, `useAnimatedLatLng`, `useRedux` typings. |
| Theme | `src/theme/global.scss` | Base styling; components use CSS modules / SCSS. |

---

## How it works (architecture)

### Data flow

1. **`useVehicleSocket(plate)`** connects to the server (default `http://localhost:3000`), listens for `vehicleData`, and filters by `plate`. On cleanup it unsubscribes.  
2. **`useVehicleTracking`** dispatches **`setVehicleStats`** when new data arrives, and **`setSocketConnected`** when the socket connects or disconnects.  
3. **`vehicleSlice`** appends each point to **`history`**, updates **`stats`**, and recomputes **`totalDistance`** and **`avgSpeed`** via **`computeNextVehicleMetrics`**.  
4. **`Map`** reads `stats` and `history`: draws the polyline, places the marker at an **interpolated** lat/lng (`useAnimatedLatLng`), and **`useMap`** calls **`flyTo`** so the camera follows the vehicle.  
5. **`Stats`** reads Redux and shows the panel when **`isPopupVisible`** is true (marker click toggles this for a few seconds).

### Animated marker and map line (last location)

The UI avoids “jumping” on every `vehicleData` tick:

| Piece | Implementation |
|-------|------------------|
| **Marker** | `useAnimatedLatLng` (`src/hooks/useAnimatedLatLng.ts`) eases the marker from the previous drawn position to the latest `stats` lat/lng over a short duration (ease-out cubic). The marker image is wrapped in **`Map.module.scss`** with two staggered **CSS pulse** rings (opacity + scale) to highlight **last location**. |
| **Route line** | The GeoJSON `LineString` is built from **all history points except the last**, then the **animated marker coordinates** are appended as the final vertex. That way the **trailing segment** moves with the marker instead of snapping. Requires at least two points in `history`. |
| **Line styling** | Two layers: a wider, blurred **`route-glow`** (lower opacity) under the main **`route-line`**, with round caps/joins. |

### Socket events (must match the backend)

Defined in `src/api/vehicle/vehicle.constant.ts`:

| Event | Direction | Purpose |
|-------|-----------|---------|
| `subscribeToVehicle` | Client → server | `{ plate: string }` — start stream for that plate. |
| `unsubscribeFromVehicle` | Client → server | `{ plate: string }` — stop stream. |
| `vehicleData` | Server → client | `{ plate, data: VehicleStats }` — periodic updates. |

### Environment variables

Add a **`.env`** file in the **`client/`** directory (same level as `package.json`). Vite only reads variables that start with **`VITE_`**.

Include **both** of the following:

| Variable | Purpose |
|----------|---------|
| **`VITE_SOCKET_SERVER_URL`** | Base URL of the Socket.IO backend (local default below). |
| **`VITE_MAPBOX_ACCESS_TOKEN`** | Mapbox **public** access token for the map (you must supply your own; see placeholder in the example). |

Example **`.env`** for local development (adjust ports if your stack differs):

```env
# Backend WebSocket / HTTP (Socket.IO) — default local port is often 3000
VITE_SOCKET_SERVER_URL=http://localhost:3000

# Mapbox — replace the placeholder with your own token from https://account.mapbox.com/
# Do not commit real keys; keep .env out of version control if it contains secrets.
VITE_MAPBOX_ACCESS_TOKEN=<add_your_own_mapbox_public_token_here>
```

The dev server for this client runs at **http://localhost:5173** by default (`npm run dev`). The socket URL above points at **http://localhost:3000** so the browser can reach a backend listening on port **3000**.

If `VITE_SOCKET_SERVER_URL` is omitted, the app falls back to **`http://localhost:3000`**. If **`VITE_MAPBOX_ACCESS_TOKEN`** is missing or still a placeholder, the map area shows a short hint instead of loading tiles.

---

## How to run

**Prerequisites:** Node.js (LTS recommended), npm, and the backend WebSocket server reachable at the URL you set in **`VITE_SOCKET_SERVER_URL`** (e.g. **http://localhost:3000**).

1. Create **`client/.env`** with **`VITE_SOCKET_SERVER_URL`** and **`VITE_MAPBOX_ACCESS_TOKEN`** as in [Environment variables](#environment-variables).  
2. Install and start the dev server:

```bash
cd client
npm install
npm run dev
```

3. Open **http://localhost:5173** (or the URL Vite prints in the terminal).

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR. |
| `npm run build` | `tsc -b` then production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | ESLint. |

---

## Customizing the tracked vehicle

The demo plate is set in `src/feature/vehicleTracking/VehicleTracking.tsx` (`DEMO_PLATE`). Change it to match a plate your backend emits, or later replace it with routing or a selector component.

---

## License

See the repository root for license information.
