import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { LocationScope } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColorByScope = (scope: LocationScope) => {
  const colorMap: Record<LocationScope, string> = {
    room: "red",
    property: "yellow",
    insula: "green",
    regio: "blue",
  };
  return colorMap[scope];
};
