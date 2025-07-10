'use client';

import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

const MapNoSSR = dynamic(() => import('./MapNoSSR'), { ssr: false });

interface MapProps {
  pickup?: LatLngExpression;
  destination?: LatLngExpression;
}

export default function MapComponent({ pickup, destination }: MapProps) {
  return (
    <div className="w-full h-[500px] rounded-xl border border-green-500 overflow-hidden">
      <MapNoSSR pickup={pickup} destination={destination} />
    </div>
  );
}
