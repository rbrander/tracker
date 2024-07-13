import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { useEffect, useMemo } from "react";

interface MapProps {
  locations: { latitude: number; longitude: number }[];
}

const Map = ({ locations }: MapProps) => {
  const polyline: LatLngExpression[] = useMemo(
    () => locations.map((loc) => [loc.latitude, loc.longitude]),
    [locations]
  );
  const center: LatLngExpression = [
    locations?.[0]?.latitude ?? 0,
    locations?.[0]?.longitude ?? 0,
  ];

  if (!Array.isArray(locations) || locations.length === 0) return null;

  return (
    <MapContainer
      center={center}
      zoom={20}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <Polyline positions={polyline} />
    </MapContainer>
  );
};

export default Map;
