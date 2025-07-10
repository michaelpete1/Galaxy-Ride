'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const abuja: LatLngExpression = [9.05785, 7.49508];

interface MapNoSSRProps {
  pickup?: LatLngExpression;
  destination?: LatLngExpression;
}

export default function MapNoSSR({ pickup, destination }: MapNoSSRProps) {
  // Center map on pickup if available, else Abuja
  const center = pickup || abuja;
  const positions = [pickup, destination].filter(Boolean) as LatLngExpression[];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {positions.length === 2 && (
        <Polyline positions={positions} color="blue" />
      )}
    </MapContainer>
  );
} 