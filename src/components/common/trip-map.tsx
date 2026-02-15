"use client";

import { Address } from "@/lib/types";

interface TripMapProps {
  pickup: Address;
  dropoff: Address;
  mileage: number;
}

function latLngToPixel(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n * 256;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    n *
    256;
  return { x, y };
}

function computeZoomAndCenter(
  pickup: Address,
  dropoff: Address,
  width: number,
  height: number
) {
  const padX = width * 0.15;
  const padY = height * 0.15;

  for (let zoom = 16; zoom >= 10; zoom--) {
    const p1 = latLngToPixel(pickup.lat, pickup.lng, zoom);
    const p2 = latLngToPixel(dropoff.lat, dropoff.lng, zoom);

    const spanX = Math.abs(p1.x - p2.x);
    const spanY = Math.abs(p1.y - p2.y);

    if (spanX <= width - padX * 2 && spanY <= height - padY * 2) {
      return {
        zoom,
        centerX: (p1.x + p2.x) / 2,
        centerY: (p1.y + p2.y) / 2,
      };
    }
  }

  const p1 = latLngToPixel(pickup.lat, pickup.lng, 10);
  const p2 = latLngToPixel(dropoff.lat, dropoff.lng, 10);
  return {
    zoom: 10,
    centerX: (p1.x + p2.x) / 2,
    centerY: (p1.y + p2.y) / 2,
  };
}

export function TripMap({ pickup, dropoff, mileage }: TripMapProps) {
  const width = 400;
  const height = 260;

  const { zoom, centerX, centerY } = computeZoomAndCenter(
    pickup, dropoff, width, height
  );

  const p1 = latLngToPixel(pickup.lat, pickup.lng, zoom);
  const p2 = latLngToPixel(dropoff.lat, dropoff.lng, zoom);

  const offsetX = centerX - width / 2;
  const offsetY = centerY - height / 2;

  const pickupPx = { x: p1.x - offsetX, y: p1.y - offsetY };
  const dropoffPx = { x: p2.x - offsetX, y: p2.y - offsetY };

  const tileSize = 256;
  const n = Math.pow(2, zoom);
  const centerTileX = Math.floor(centerX / tileSize);
  const centerTileY = Math.floor(centerY / tileSize);
  const tilesNeededX = Math.ceil(width / tileSize) + 2;
  const tilesNeededY = Math.ceil(height / tileSize) + 2;
  const halfX = Math.floor(tilesNeededX / 2);
  const halfY = Math.floor(tilesNeededY / 2);

  const tiles: { tileX: number; tileY: number; px: number; py: number }[] = [];
  for (let dx = -halfX; dx <= halfX; dx++) {
    for (let dy = -halfY; dy <= halfY; dy++) {
      const tx = centerTileX + dx;
      const ty = centerTileY + dy;
      if (tx < 0 || ty < 0 || tx >= n || ty >= n) continue;
      tiles.push({
        tileX: tx,
        tileY: ty,
        px: tx * tileSize - offsetX,
        py: ty * tileSize - offsetY,
      });
    }
  }

  const midX = (pickupPx.x + dropoffPx.x) / 2;
  const midY = (pickupPx.y + dropoffPx.y) / 2;
  const dx = dropoffPx.x - pickupPx.x;
  const dy = dropoffPx.y - pickupPx.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curveAmt = dist * 0.15;
  const nx = dist > 0 ? -dy / dist : 0;
  const ny = dist > 0 ? dx / dist : 0;
  const ctrlX = midX + nx * curveAmt;
  const ctrlY = midY + ny * curveAmt;

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-surface-muted">
      <div className="flex justify-center overflow-hidden" style={{ maxHeight: height }}>
        <div className="relative shrink-0" style={{ width, height }}>
          {tiles.map(({ tileX, tileY, px, py }) => (
            <img
              key={`${tileX}-${tileY}`}
              src={`https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`}
              alt=""
              width={tileSize}
              height={tileSize}
              className="absolute"
              style={{ left: px, top: py }}
              draggable={false}
            />
          ))}

          <svg className="absolute inset-0" width={width} height={height}>
            <path
              d={`M ${pickupPx.x} ${pickupPx.y} Q ${ctrlX} ${ctrlY} ${dropoffPx.x} ${dropoffPx.y}`}
              stroke="#1e40af"
              strokeWidth="3"
              strokeDasharray="8 4"
              fill="none"
              strokeLinecap="round"
            />
            <g transform={`translate(${pickupPx.x}, ${pickupPx.y})`}>
              <circle r="10" fill="#17CB6C" stroke="white" strokeWidth="2" />
              <text textAnchor="middle" y="1" fill="white" fontSize="9" fontWeight="bold" dominantBaseline="middle">P</text>
              <text textAnchor="middle" y="-17" fill="#171717" fontSize="9" fontWeight="600" paintOrder="stroke" stroke="white" strokeWidth="3">{pickup.label}</text>
            </g>
            <g transform={`translate(${dropoffPx.x}, ${dropoffPx.y})`}>
              <circle r="10" fill="#dc2626" stroke="white" strokeWidth="2" />
              <text textAnchor="middle" y="1" fill="white" fontSize="9" fontWeight="bold" dominantBaseline="middle">D</text>
              <text textAnchor="middle" y="-17" fill="#171717" fontSize="9" fontWeight="600" paintOrder="stroke" stroke="white" strokeWidth="3">{dropoff.label}</text>
            </g>
          </svg>

          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-medium text-text-primary border border-border shadow-sm">
            {mileage.toFixed(1)} mi
          </div>
        </div>
      </div>
      <div className="px-2 py-0.5 text-[9px] text-text-muted bg-white">
        &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
      </div>
    </div>
  );
}
