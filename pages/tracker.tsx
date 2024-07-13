import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { TrackingPosition } from "@/types/TrackingPosition";

// need to ensure we load this client-side only as it requires 'window'
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const TrackerPage = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackedPositions, setTrackedPositions] = useState<TrackingPosition[]>(
    []
  );

  const toggleIsTracking = useCallback(() => {
    setIsTracking((isTracking: boolean) => !isTracking);
  }, [setIsTracking]);

  const onGeolocationPositionSuccess = useCallback(
    (location: GeolocationPosition) => {
      const {
        coords: { latitude, longitude },
        timestamp,
      } = location;
      setTrackedPositions((positions) => [
        ...positions,
        { timestamp, latitude, longitude },
      ]);
    },
    [setTrackedPositions]
  );
  const onGeolocationPositionError = useCallback(
    (error: GeolocationPositionError) => console.error(error),
    []
  );

  useEffect(() => {
    let watchId: number = 0;
    if (isTracking) {
      watchId = navigator.geolocation.watchPosition(
        onGeolocationPositionSuccess,
        onGeolocationPositionError,
        { maximumAge: 0, enableHighAccuracy: true }
      );
      setTrackedPositions([]);
    } else if (!isTracking && watchId !== 0) {
      navigator.geolocation.clearWatch(watchId);
    }
    return () => {
      if (watchId !== 0) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, onGeolocationPositionError, onGeolocationPositionSuccess]);

  const saveTrip = useCallback(() => {
    console.log("saving data...");
    fetch("/api/trip", {
      method: "POST",
      body: JSON.stringify(trackedPositions),
    })
      .then((response) => {
        console.log("response:", response);
        console.log("saved!");
      })
      .catch((error) => console.error(error));
  }, [trackedPositions]);

  return (
    <div className="bg-slate-900 text-white p-4 min-h-dvh flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="text-3xl">Tracker</h1>
        <nav>
          <Link className="py-2 px-4 bg-slate-700 rounded" href="/trips">
            Back to trips
          </Link>
        </nav>
      </header>
      <div className="flex gap-4">
        <button
          className="rounded border py-2 px-4 bg-slate-700"
          type="button"
          onClick={toggleIsTracking}
        >
          {isTracking ? "Stop" : "Start"}
        </button>
        {!isTracking && trackedPositions.length > 0 && (
          <button
            className="rounded border py-2 px-4 bg-slate-700"
            type="button"
            onClick={saveTrip}
          >
            Save Trip
          </button>
        )}
      </div>
      <main className="flex flex-col gap-4">
        <h2 className="text-2xl italic">
          {isTracking ? "Tracking..." : "Let's get going!"}
        </h2>
        {isTracking && (
          <Map
            locations={trackedPositions.map((loc: TrackingPosition) => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
            }))}
          />
        )}
        {trackedPositions.length > 0 && (
          <>
            <ul>
              {trackedPositions.map((position: TrackingPosition) => (
                <li key={`${position.timestamp}`}>
                  {new Date(position.timestamp).toLocaleTimeString()}:{" "}
                  {position.latitude}x{position.longitude}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackerPage;
