import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { TrackingPosition } from "@/types/TrackingPosition";
import { useRouter } from "next/router";

// need to ensure we load this client-side only as it requires 'window'
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const fetchTrip = async (id: string) =>
  fetch("/api/trip/" + id)
    .then((response) => response.json())
    .catch((error) => console.error(error));

const ViewTripPage = () => {
  const [trackedPositions, setTrackedPositions] = useState<TrackingPosition[]>(
    []
  );

  // id will be undefined when the page is first loaded
  const { id } = useRouter().query;

  useEffect(() => {
    if (typeof id === "string") {
      console.log("Fetching trip...", id);
      fetchTrip(id).then(setTrackedPositions);
    }
  }, [id]);

  return (
    <div className="bg-slate-900 text-white p-4 min-h-dvh flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="text-3xl">View Trip</h1>
        <nav>
          <Link className="py-2 px-4 bg-slate-700 rounded" href="/trips">
            Back to trips
          </Link>
        </nav>
      </header>
      <main className="flex flex-col gap-4">
        <Map
          locations={trackedPositions.map((loc) => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
          }))}
        />
        {trackedPositions.length > 0 && (
          <>
            <h2 className="text-xl">Tracked Positions</h2>
            <ul>
              {trackedPositions.map((position: TrackingPosition) => (
                <li key={`${position.timestamp}`}>
                  {new Date(position.timestamp).toLocaleTimeString()}: (lat:{" "}
                  {position.latitude}, long: {position.longitude})
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default ViewTripPage;
