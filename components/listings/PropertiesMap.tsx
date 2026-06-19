"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/types/property";

const OLIVE = "#6f673d";

export default function PropertiesMap({
  properties,
  heightClass = "h-[560px]",
}: {
  properties: Property[];
  heightClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      }).setView([9.7489, -83.7534], 7);
      mapRef.current = map;

      // Minimal light basemap (free, no API key)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      const pin = (label: string) =>
        L.divIcon({
          className: "",
          html: `
            <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
              <div style="background:${OLIVE};color:#fff;font-family:system-ui,sans-serif;font-size:11px;font-weight:600;padding:5px 9px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${label}</div>
              <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${OLIVE};margin-top:-1px;"></div>
            </div>`,
          iconSize: [60, 34],
          iconAnchor: [30, 34],
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markers: any[] = [];
      properties
        .filter((p) => p.geo)
        .forEach((p) => {
          const m = L.marker([p.geo!.lat, p.geo!.lng], { icon: pin(p.price) }).addTo(map);
          m.bindPopup(
            `<div style="font-family:system-ui,sans-serif;min-width:160px;">
               <div style="font-weight:600;color:#16110d;font-size:14px;">${p.title}</div>
               <div style="color:#6b6b6b;font-size:12px;margin-top:2px;">${p.location}</div>
               <div style="color:#16110d;font-weight:600;margin-top:6px;">${p.price}</div>
               <a href="/listings/${p.slug}" style="color:${OLIVE};font-size:12px;text-transform:uppercase;letter-spacing:0.08em;display:inline-block;margin-top:8px;">View property →</a>
             </div>`
          );
          markers.push(m);
        });

      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.35), { maxZoom: 12 });
      }

      // Recalculate size after layout settles
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties]);

  return (
    <div
      ref={containerRef}
      className={`${heightClass} w-full overflow-hidden rounded-[20px] border border-[var(--nakma-dark)]/10`}
    />
  );
}
