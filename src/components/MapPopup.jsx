import React from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

const MapPopup = ({ latitude, longitude, showPopup, onClose }) => {
  if (!showPopup) return null;
  const TOKEN=process.env.REACT_APP_MAP_KEY;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 relative"
        style={{ width: "600px", height: "600px" }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <Map
          mapboxAccessToken={TOKEN}
          style={{ width: "100%", height: "100%", borderRadius: "10px" }}
          initialViewState={{
            longitude,
            latitude,
            zoom: 12,
          }}
        >
          <Marker longitude={longitude} latitude={latitude} />
          <NavigationControl position="bottom-right" />
          <FullscreenControl />
          <GeolocateControl />
        </Map>
      </div>
    </div>
  );
};

export default MapPopup;
