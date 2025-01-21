// gpx-handler.js

export function initializeMap(gpxFilePath, mapElementId, elevationDivId) {
    const mapElement = document.getElementById(mapElementId);
    const elevationDiv = document.getElementById(elevationDivId);
  
    if (!mapElement || !gpxFilePath) {
      console.error("Map element or GPX file path is missing.");
      return;
    }
  
    const map = L.map(mapElementId).setView([51.505, -0.09], 15); // Adjust initial zoom level
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
  
    // Add elevation control
    const elevationControl = L.control.elevation({
      theme: "steelblue-theme",
      detached: true,
      elevationDiv: `#${elevationDivId}`,
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
  
    // Load GPX file
    fetch(gpxFilePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load GPX file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((gpxData) => {
        elevationControl.load(gpxData, "gpx");
  
        // Add the GPX layer to the map
        const gpxLayer = new L.GPX(gpxData, {
          async: true,
          marker_options: {
            startIconUrl: "/leaflet-icons/pin-icon-start.png",
            endIconUrl: "/leaflet-icons/pin-icon-end.png",
            shadowUrl: "/leaflet-icons/images/pin-shadow.png",
          },
        })
          .on("loaded", function (e) {
            const gpx = e.target;
            map.fitBounds(gpx.getBounds());
  
            // Display additional data
            const startTime = gpx.get_start_time().toISOString();
            const endTime = gpx.get_end_time().toISOString();
            const movingTime = gpx.get_moving_time();
            const movingSpeed = gpx.get_moving_speed().toFixed(2);
            const elevationGain = gpx.get_elevation_gain().toFixed(2);
  
            const movingTimeFormatted = new Date(movingTime)
              .toISOString()
              .substr(11, 8);
  
            const formattedStartTime = `${startTime.slice(0, 10)} ${startTime.slice(11, 16)}`;
            const formattedEndTime = `${endTime.slice(0, 10)} ${endTime.slice(11, 16)}`;
  
            const infoDiv = L.control({ position: "topright" });
            infoDiv.onAdd = function () {
              const div = L.DomUtil.create("div", "info-panel");
              div.innerHTML = `
                <p><b>Start Time:</b> ${formattedStartTime}</p>
                <p><b>End Time:</b> ${formattedEndTime}</p>
                <p><b>Moving Time:</b> ${movingTimeFormatted}</p>
                <p><b>Average Speed:</b> ${movingSpeed} km/h</p>
                <p><b>Elevation Gain:</b> ${elevationGain} m</p>
              `;
              return div;
            };
            infoDiv.addTo(map);
          })
          .on("error", function (e) {
            console.error("Error loading GPX file:", e);
          })
          .addTo(map);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  