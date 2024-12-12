import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ProfileCard.css";

const ProfileCard = ({ profile, onClick }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div
      className={`profile-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
        showMap ? "expanded" : ""
        
      }` } onClick={onClick}
    >
      <div className="profile-card-header h-48 overflow-hidden">
        <img
          src={profile.photographUrl}
          alt={`${profile.name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="profile-card-body p-4">
        <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{profile.description}</p>
      </div>
      <div className="profile-card-footer p-4 border-t">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => setShowMap((prev) => !prev)}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>
      {showMap && (
        <div className="map-container mt-4">
          <MapContainer
            center={[profile.latitude, profile.longitude]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[profile.latitude, profile.longitude]}>
              <Popup>
                <div>
                  <h3 className="text-lg font-medium">{profile.name}</h3>
                  <p className="text-gray-600">{profile.address}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
