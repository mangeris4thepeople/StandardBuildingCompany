import React from 'react';

// Line drawings in the language of a construction document set: a framing elevation for the
// home hero and a site-plan style map for the service area. Both are decorative, so they are
// hidden from assistive tech; the same information is in the page text.

const line = (delay) => ({ pathLength: 1, style: { '--d': `${delay}s` } });

export function HeroDrawing() {
  // A residential front elevation: main gable with a glass wall, a lower wing, and a covered deck.
  return (
    <svg className="draw" viewBox="0 0 600 470" aria-hidden="true" focusable="false">
      {/* Level lines */}
      <g className="draw__faint">
        <path className="draw__dash" d="M60 130 H 575 M60 256 H 575" />
        <path className="draw__tick" d="M566 124 l6 6 l6 -6 z M566 250 l6 6 l6 -6 z M566 384 l6 6 l6 -6 z" />
      </g>

      {/* Grade */}
      <path className="draw__line draw__line--heavy" d="M14 390 H 590" {...line(0)} />
      <g className="draw__faint">
        {Array.from({ length: 29 }).map((_, i) => (
          <path key={i} d={`M${24 + i * 20} 390 l -10 12`} className="draw__tick" />
        ))}
      </g>

      {/* Trees */}
      <path className="draw__line" d="M22 390 L 44 296 L 66 390 M44 330 V 390" {...line(0.2)} />
      <path className="draw__line" d="M552 390 L 572 300 L 592 390 M572 332 V 390" {...line(0.3)} />

      {/* Main volume and gable */}
      <path className="draw__line draw__line--heavy" d="M232 390 V 256 M448 390 V 256" {...line(0.35)} />
      <path className="draw__line draw__line--heavy" d="M214 268 L 340 130 L 466 268" {...line(0.6)} />
      <path className="draw__line" d="M232 256 H 448" {...line(0.8)} />
      <path className="draw__line" d="M290 238 L 340 182 L 390 238 Z" {...line(0.95)} />
      <path className="draw__line" d="M266 278 H 414 V 390 M266 390 V 278" {...line(1.05)} />
      <path className="draw__line" d="M315 278 V 390 M365 278 V 390 M266 306 H 414" {...line(1.2)} />

      {/* Chimney */}
      <path className="draw__line" d="M396 186 V 146 H 420 V 212" {...line(1.0)} />

      {/* Wing */}
      <path className="draw__line draw__line--heavy" d="M92 390 V 294" {...line(0.45)} />
      <path className="draw__line draw__line--heavy" d="M76 305 L 160 240 L 232 296" {...line(0.75)} />
      <path className="draw__line" d="M110 318 h40 v44 h-40 z M172 318 h40 v44 h-40 z" {...line(1.3)} />
      <path className="draw__line" d="M130 318 v44 M192 318 v44" {...line(1.4)} />

      {/* Covered deck */}
      <path className="draw__line" d="M448 300 L 548 318" {...line(1.1)} />
      <path className="draw__line" d="M472 304 V 390 M536 316 V 390" {...line(1.25)} />
      <path className="draw__line" d="M448 352 H 548 M448 362 H 548" {...line(1.45)} />
      <g className="draw__faint">
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M${456 + i * 11} 362 V 390`} className="draw__tick" />
        ))}
      </g>

      {/* Dimensions and notes */}
      <g className="draw__note">
        <path d="M92 424 H 548 M92 416 v16 M232 416 v16 M448 416 v16 M548 416 v16" className="draw__dim" />
        <text x="162" y="446" textAnchor="middle">{"24'-0\""}</text>
        <text x="340" y="446" textAnchor="middle">{"36'-0\""}</text>
        <text x="498" y="446" textAnchor="middle">{"16'-0\""}</text>
        <text x="560" y="122" textAnchor="end">Ridge</text>
        <text x="560" y="248" textAnchor="end">Plate</text>
        <text x="20" y="40" className="draw__title">Front elevation</text>
        <text x="20" y="60">{'Scale 1/8" = 1\'-0"'}</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ MAP */

const TOWNS = [
  { name: 'Loveland', lat: 40.398, lon: -105.075, side: 'left', home: true },
  { name: 'Fort Collins', lat: 40.585, lon: -105.084, side: 'left' },
  { name: 'Greeley', lat: 40.423, lon: -104.709, side: 'right' },
  { name: 'Longmont', lat: 40.167, lon: -105.102, side: 'left' },
  { name: 'Windsor', lat: 40.477, lon: -104.901, side: 'right' },
  { name: 'Berthoud', lat: 40.308, lon: -105.081, side: 'left' },
  { name: 'Johnstown', lat: 40.337, lon: -104.912, side: 'right' },
  { name: 'Timnath', lat: 40.529, lon: -104.985, side: 'right' },
  { name: 'Wellington', lat: 40.704, lon: -105.009, side: 'right' },
  { name: 'Estes Park', lat: 40.377, lon: -105.522, side: 'right' },
];

// Simple equirectangular projection, scaled so distances read true at this latitude.
const X = (lon) => 30 + ((lon + 105.6) / 0.98) * 410;
const Y = (lat) => 30 + ((40.76 - lat) / 0.66) * 350;

export function AreaMap() {
  const foothills = [40.74, 40.66, 40.58, 40.5, 40.42, 40.34, 40.26, 40.18, 40.12];
  return (
    <svg className="map" viewBox="0 0 480 410" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="478" height="408" className="map__frame" />

      {/* Foothills, where the plains meet the Front Range */}
      <path
        className="map__hills"
        d={foothills
          .map((lat, i) => `${i ? 'L' : 'M'}${X(-105.2 + (i % 2 ? 0.03 : -0.02)).toFixed(1)} ${Y(lat).toFixed(1)}`)
          .join(' ')}
      />
      <text x={X(-105.47)} y={Y(40.63)} className="map__label map__label--quiet">Front Range</text>

      {/* Highways */}
      <path className="map__road" d={`M${X(-105.0)} ${Y(40.75)} L${X(-104.99)} ${Y(40.4)} L${X(-104.98)} ${Y(40.12)}`} />
      <text x={X(-104.99) + 6} y={Y(40.235)} className="map__label map__label--quiet">I-25</text>
      <path className="map__road" d={`M${X(-105.5)} ${Y(40.38)} L${X(-105.2)} ${Y(40.41)} L${X(-104.72)} ${Y(40.41)}`} />
      <text x={X(-104.86)} y={Y(40.41) - 8} className="map__label map__label--quiet">US 34</text>

      {TOWNS.map((t) => {
        const x = X(t.lon);
        const y = Y(t.lat);
        const left = t.side === 'left';
        return (
          <g key={t.name}>
            {t.home ? (
              <>
                <circle cx={x} cy={y} r="13" className="map__ring" />
                <rect x={x - 5} y={y - 5} width="10" height="10" className="map__home" />
              </>
            ) : (
              <circle cx={x} cy={y} r="4" className="map__dot" />
            )}
            <text
              x={x + (left ? -1 : 1) * (t.home ? 14 : 10)}
              y={y + (t.home ? -16 : 4.5)}
              textAnchor={left ? 'end' : 'start'}
              className={`map__label${t.home ? ' map__label--home' : ''}`}
            >
              {t.name}
            </text>
          </g>
        );
      })}

      {/* North arrow */}
      <g className="map__north">
        <path d="M448 62 V 28 M448 28 l -6 11 M448 28 l 6 11" />
        <text x="448" y="78" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}
