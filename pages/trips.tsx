import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrackingPosition } from "@/types/TrackingPosition";

const calcTripDuration = (trip: TrackingPosition[]) => {
  const timestamps = Array.from(
    new Set(trip.map(({ timestamp }) => timestamp))
  );
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const duration = max - min;
  if (duration < 1_000) {
    // 1 second in ms
    return `${duration}ms`;
  } else if (duration < 60_000) {
    // 1 minute in ms
    return `${Math.floor(duration / 60)}s`;
  } else if (duration < 3_600_000) {
    // 1 hour in ms
    const minutes = duration / 60_000;
    const seconds = (duration - minutes * 60_000) / 1_000;
    return `${minutes}m ${seconds}s`;
  }
  return `${duration}ms`;
};

function calculateDistance(pos1: TrackingPosition, pos2: TrackingPosition) {
  // Simple distance calculation (you might want a more accurate method)
  const earthRadiusInMeters = 6371e3; // Earth's radius in meters
  const lat1 = (pos1.latitude * Math.PI) / 180;
  const lat2 = (pos2.latitude * Math.PI) / 180;
  const lon1 = (pos1.longitude * Math.PI) / 180;
  const lon2 = (pos2.longitude * Math.PI) / 180;
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  return earthRadiusInMeters * c;
}
const calcTripDistance = (trip: TrackingPosition[]) => {
  if (trip.length <= 1) return 0;

  let totalDistance = 0;
  for (let i = 0; i < trip.length - 1; i++) {
    totalDistance += calculateDistance(trip[i], trip[i + 1]);
  }
  return Math.floor(totalDistance);
};

type TripProps = {
  id: number;
  trip: TrackingPosition[];
};

const Trip = ({ id, trip }: TripProps) => {
  const time = new Date(trip[0].timestamp).toLocaleString();
  const duration = calcTripDuration(trip);
  const distance = calcTripDistance(trip);
  return (
    <li className="p-4 bg-slate-300 text-black rounded border-r-2 border-black">
      <Link href={`/view-trip/${id}`}>
        <p>
          Date: {time} - {duration}
        </p>
        <p>Distance: {distance}m</p>
      </Link>
    </li>
  );
};

const Trips = () => {
  const [trips, setTrips] = useState<TrackingPosition[][]>([]);
  useEffect(() => {
    fetch("/api/trip")
      .then((response) => response.json())
      .then(setTrips);
  }, []);
  return (
    <div className="bg-slate-900 text-white p-4 min-h-dvh flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="text-3xl">Trips</h1>
        <nav>
          <Link
            className="rounded border py-2 px-4 bg-slate-700"
            href="/tracker"
          >
            New Trip
          </Link>
        </nav>
      </header>
      <main className="flex flex-col gap-4">
        <p>Found {trips.length} trips</p>
        <ul className="flex flex-col gap-1">
          {trips.map((trip: TrackingPosition[], index: number) => (
            <Trip id={index} trip={trip} key={index} />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Trips;
