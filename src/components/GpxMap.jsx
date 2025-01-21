import { createSignal, onMount } from "solid-js";

/** Helper to load a script from a given src, returning a Promise. */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Props:
 *  - gpxFile: string (URL/path to your GPX file)
 */
export default function GpxMap(props) {
  // Track whether the collapsible map is open
  const [isOpen, setIsOpen] = createSignal(false);
  const [isLoaded, setIsLoaded] = createSignal(false); // Tracks if map initialization is complete

  async function initMapIfNeeded() {
    if (typeof window !== "undefined" && props.gpxFile && !isLoaded()) {
      try {
        // 1) Load Leaflet
        if (!window.L) {
          await loadScript("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js");
          const leafletCSS = document.createElement("link");
          leafletCSS.rel = "stylesheet";
          leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
          document.head.appendChild(leafletCSS);
        }

        // 2) Load Leaflet-GPX
        if (!window.L?.GPX) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/2.1.2/gpx.min.js"
          );
        }

        // 3) Load Leaflet-Elevation
        if (!window.L?.control?.elevation) {
          await loadScript(
            "https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.min.js"
          );
          const elevationCSS = document.createElement("link");
          elevationCSS.rel = "stylesheet";
          elevationCSS.href =
            "https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.min.css";
          document.head.appendChild(elevationCSS);
        }

        // Initialize the map
        const map = L.map("map").setView([51.505, -0.09], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        const elevationControl = L.control.elevation({
          theme: "steelblue-theme",
          detached: true,
          elevationDiv: "#elevation-div",
          followMarker: true,
          autofitBounds: true,
          waypoints: true,
          wptIcons: false,
          altitude: true,
          distance: true,
          distanceMarkers: false,
          height: 200,
          collapsed: true,
          time: true,
          edgeScale: false,
          hotline: true,
        });
        elevationControl.addTo(map);

        const gpxData = await fetch(props.gpxFile).then((r) => {
          if (!r.ok) throw new Error(`Failed to load GPX file: ${r.statusText}`);
          return r.text();
        });

        elevationControl.load(gpxData, "gpx");

        new L.GPX(gpxData, {
          async: true,
          marker_options: {
            startIconUrl: "/leaflet-icons/pin-icon-start.png",
            endIconUrl: "/leaflet-icons/pin-icon-end.png",
            shadowUrl: "/leaflet-icons/pin-shadow.png",
          },
        })
          .on("loaded", (e) => {
            map.fitBounds(e.target.getBounds());

            // Add Info Panel with GPX Stats
            const startTime = e.target.get_start_time()?.toISOString() || "";
            const endTime = e.target.get_end_time()?.toISOString() || "";
            const movingTime = e.target.get_moving_time();
            const movingSpeed = e.target.get_moving_speed().toFixed(2);
            const elevationGain = e.target.get_elevation_gain().toFixed(2);

            const movingTimeFormatted = new Date(movingTime)
              .toISOString()
              .slice(11, 19);

            const infoDiv = L.control({ position: "topright" });
            infoDiv.onAdd = function () {
              const div = L.DomUtil.create("div", "info-panel");
              div.innerHTML = `
                <p><b>Start Time:</b> ${startTime.slice(0, 10)} ${startTime.slice(
                11,
                16
              )}</p>
                <p><b>End Time:</b> ${endTime.slice(0, 10)} ${endTime.slice(
                11,
                16
              )}</p>
                <p><b>Moving Time:</b> ${movingTimeFormatted}</p>
                <p><b>Average Speed:</b> ${movingSpeed} km/h</p>
                <p><b>Elevation Gain:</b> ${elevationGain} m</p>
              `;
              return div;
            };
            infoDiv.addTo(map);
          })
          .addTo(map);

        setIsLoaded(true);
      } catch (err) {
        console.error("Error initializing Leaflet map:", err);
      }
    }
  }

  function toggleCollapse() {
    if (!isOpen()) {
      initMapIfNeeded(); // Initialize map only on the first open
    }
    setIsOpen(!isOpen());
  }

  return (
    <div class="my-4">
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
        {isOpen() ? "Hide Map" : "Show GPX"}
      </button>

      {/* Collapsible Container with Smooth Transition */}
      <div
        class={`mt-4 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen() ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        {/* Styles for map, info panel, and elevation chart */}
        <style>
          {`
          .info-panel {
            background: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.4;
          }

          .info-panel h4 {
            margin: 0 0 5px;
            font-size: 16px;
            color: #000;
          }

          .info-panel p {
            margin: 5px 0;
            font-size: 14px;
          }

          #map {
            width: 100%;
            height: 500px; /* Adjust as desired */
            border-radius: 10px;
            overflow: hidden;
          }

          #elevation-div {
            width: 100%;
            height: 100%; /* Matches the height from the config (200px in control) */
            border-radius: 10px;
            overflow: hidden;
          }
        `}
        </style>

        {/* Map and Elevation Chart */}
        <div id="map" class="mt-4"></div>
        <div id="elevation-div" class="mt-4"></div>
      </div>
    </div>
  );
}
