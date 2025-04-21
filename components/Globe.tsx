"use client"

import { Feature, Point, GeoJsonProperties } from "geojson";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import GlobeGL from "react-globe.gl";
import * as topojson from "topojson-client";
import { Button } from "./ui/button";
const Globe = ({ guesses, target, countries, setTarget, setGuesses, setGameWon }: any) => {
  const globeRef = useRef<any>(null);
  
  const [geoJsonData, setGeoJsonData] = useState<Feature<Point, GeoJsonProperties> | null>(null);

  const markerData = guesses
    .map((name: string) => countries.find((c: any) => c.name === name))
    .filter(Boolean)
    .map((c: any) => ({
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      size: 0.4,
      color: c.name === target ? "green" : "red",
    }));
    // this marker data can mark the country (not using for now)

  useEffect(() => {
    if (globeRef.current && markerData.length > 0) {
      const latest = markerData[0];
      globeRef.current.pointOfView({ lat: latest.lat, lng: latest.lng, altitude: 1.5 }, 1000);
    }
  }, [guesses]);

  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(res => res.json())
      .then(worldData => {
        const countries = topojson.feature(worldData, worldData.objects.countries);
        setGeoJsonData(countries);  
      });
  }, []);

  const resetGame = () => {
    setGuesses([]);
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    setTarget(randomCountry.name);
    setGameWon(false);
  };

  const polygonCapColor = (polygon : any) => {
    const name = polygon.properties?.name;
    if (guesses.includes(name)) {
      return name === target ? "rgba(0, 255, 0, 0.4)" : "rgba(255, 0, 0, 0.4)";
    }
    return "rgba(255, 255, 255, 0.05)";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-96 max-w-full overflow-hidden flex justify-center items-center">
        <GlobeGL
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(0,0,0,0)"
          width={600}
          height={384}
          pointAltitude="size"
          pointColor="color"
          polygonsData={(geoJsonData as any)?.features|| []}
          polygonCapColor={polygonCapColor}
          polygonSideColor={() => "rgba(0, 100, 255, 0.15)"}
          polygonStrokeColor={() => "#111"}
          polygonLabel={({ properties }: { properties?: { name?: string } }) => properties?.name || ""}
        />
      </div>
      <Button onClick={resetGame}>
        Play again
      </Button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Globe), { ssr: false });