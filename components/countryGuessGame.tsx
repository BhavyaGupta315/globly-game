"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { GlobeIcon} from "lucide-react";
import countries from "@/data/countries.json";
import { getDirection, getDistanceColor } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";

const Globe = dynamic(() => import("@/components/Globe"), { ssr: false });

export default function CountryGuessGame() {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("");
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const random = countries[Math.floor(Math.random() * countries.length)];
    setTarget(random.name);
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (
      trimmed &&
      countries.some((c) => c.name.toLowerCase() === trimmed.toLowerCase()) &&
      !guesses.includes(trimmed)
    ) {
      setGuesses([trimmed, ...guesses]);
      setGuess("");
      if (trimmed.toLowerCase() === target.toLowerCase()) {
        setGameWon(true);
      }
    }
  };

  const getDistance = (guessName: string) => {
    const from = countries.find(
      (c) => c.name.toLowerCase() === guessName.toLowerCase()
    );
    const to = countries.find((c) => c.name === target);
    if (!from || !to) return 0;

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(parseFloat(to.lat) - parseFloat(from.lat));
    const dLon = toRadians(parseFloat(to.lng) - parseFloat(from.lng));
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(parseFloat(from.lat))) *
        Math.cos(toRadians(parseFloat(to.lat))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(guess.toLowerCase())
  ).slice(0, 6);

  return (
    <main className="max-w-3xl mx-auto p-4 border shadow-lg h-full flex flex-col justify-center m-10 items-center bg-[#f6f6f6] rounded-lg">
      <div>
        <div className="flex justify-center items-center gap-2 my-6">
          <GlobeIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-center">Guess the Country</h1>
        </div>
        <div className="p-4">
          {!gameWon && (
            <div>
              <form onSubmit={handleGuess} className="gap-2 mb-4 flex flex-col justify-center items-center">
            <Input
              placeholder="Enter country name"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full max-w-lg"
              list="suggestions"
            />
            <Button
              type="submit"
              variant={'destructive'}
              className="mt-2"
              size={"lg"}
            >
              Guess
            </Button>
          </form>

          <datalist id="suggestions" className="hover:cursor-pointer">
            {filteredCountries.map((c) => (
              <option key={c.name} value={c.name} className="hover:cursor-pointer"/>
            ))}
          </datalist>
              </div>
          )}
          
        </div>
      </div>
      <div>
          <div className="mb-6 w-150">
            <Globe guesses={guesses} target={target} countries={countries} setGuesses={setGuesses} setTarget={setTarget} setGameWon={setGameWon}/>
          </div>
      </div>
      <div className="w-[80%]">
          <div className="grid gap-2">
            {guesses.map((g, i) => {
              const from = countries.find(c => c.name.toLowerCase() === g.toLowerCase());
              const to = countries.find(c => c.name === target);

              const distance = getDistance(g);
              const color = getDistanceColor(distance);

              const direction = from && to
              ? getDirection(parseFloat(from.lat), parseFloat(from.lng), parseFloat(to.lat), parseFloat(to.lng))
              : "";
              return (
                <div
                  key={i}
                  className="p-4 flex justify-between text-white font-semibold rounded-lg shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  <span>{g}</span>
                  <span>{distance} km</span>
                  <span>{direction}</span>
                </div>
              );
            })}
          </div>

          {gameWon && (
            <div className="text-center mt-6 text-green-600 font-bold text-xl">
              🎉 Correct! The country was {target}.
            </div>
          )}
      </div>
    </main>
  );
}
