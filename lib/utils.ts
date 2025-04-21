import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDistanceColor(distance: number): string {
  if (distance === 0) return "#00C853";
  if (distance < 1000) return "#AEEA00";
  if (distance < 3000) return "#FFD600";
  if (distance < 6000) return "#FF6F00";
  if (distance < 10000) return "#D50000";
  return "#B71C1C";
}

export function getDirection(fromLat: number, fromLon: number, toLat: number, toLon: number): string {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRadians(toLon - fromLon);
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);

  const y = Math.sin(dLon) * Math.cos(toLatRad);
  const x = Math.cos(fromLatRad) * Math.sin(toLatRad) - Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(dLon);
  const brng = toDegrees(Math.atan2(y, x));
  const bearing = (brng + 360) % 360;

  const directions = [
    '⬆️ N', '↗️NE', '➡️ E', '↘️SE', '⬇️ S', '↙️SW', '⬅️ W', '↖️NW'
  ];

  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}
