import React from 'react';

// Line drawings in the language of a construction document set: a framing elevation for the
// home hero and a site-plan style map for the service area. Both are decorative, so they are
// hidden from assistive tech; the same information is in the page text.

const line = (delay) => ({ pathLength: 1, style: { '--d': `${delay}s` } });

export function HeroDrawing() {
  return (
    <svg className="draw" viewBox="0 0 560 500" aria-hidden="true" focusable="false">
      {/* Grid bubbles and centerlines */}
      <g className="draw__faint">
        {[70, 170, 270].map((x, i) => (
          <g key={x}>
            <path className="draw__dash" d={`M${x} 92 V 440`} />
            <circle cx={x} cy="74" r="17" {...line(0.1 + i * 0.08)} className="draw__line" />
            <text x={x} y="80" textAnchor="middle" className="draw__bubble">{'ABC'[i]}</text>
          </g>
        ))}
      </g>

      {/* Grade */}
      <path className="draw__line draw__line--heavy" d="M14 420 H 546" {...line(0)} />
      <g className="draw__faint">
        {Array.from({ length: 27 }).map((_, i) => (
          <path key={i} d={`M${24 + i * 20} 420 l -10 12`} className="draw__tick" />
        ))}
      </g>

      {/* Commercial bay: steel frame */}
      <path className="draw__line" d="M56 420 h28 M156 420 h28 M256 420 h28" {...line(0.25)} />
      <path className="draw__line draw__line--heavy" d="M70 420 V 150" {...line(0.35)} />
      <path className="draw__line draw__line--heavy" d="M170 420 V 150" {...line(0.45)} />
      <path className="draw__line draw__line--heavy" d="M270 420 V 150" {...line(0.55)} />
      <path className="draw__line draw__line--heavy" d="M58 290 H 282" {...line(0.75)} />
      <path className="draw__line draw__line--heavy" d="M58 150 H 282" {...line(0.9)} />
      <path className="draw__line" d="M58 172 H 282" {...line(1.0)} />
      <path
        className="draw__line"
        d="M70 172 L 95 150 L 120 172 L 145 150 L 170 172 L 195 150 L 220 172 L 245 150 L 270 172"
        {...line(1.1)}
      />
      <path className="draw__line" d="M70 420 L 170 290 M170 420 L 70 290" {...line(1.3)} />
      <path className="draw__line" d="M50 150 V 132 H 290 V 150" {...line(1.45)} />

      {/* Residential: gable framing */}
      <path className="draw__line draw__line--heavy" d="M340 420 V 292 M500 420 V 292" {...line(0.6)} />
      <path className="draw__line draw__line--heavy" d="M322 300 L 420 204 L 518 300" {...line(1.0)} />
      <path className="draw__line" d="M340 292 H 500" {...line(1.2)} />
      <path className="draw__line" d="M420 204 V 292 M380 243 V 292 M460 243 V 292" {...line(1.35)} />
      <path className="draw__line" d="M404 420 V 348 H 436 V 420" {...line(1.5)} />
      <path className="draw__line" d="M356 338 h30 v34 h-30 z M454 338 h30 v34 h-30 z" {...line(1.6)} />
      <path className="draw__line" d="M371 338 v34 M469 338 v34" {...line(1.7)} />

      {/* Dimensions and elevation marks */}
      <g className="draw__note">
        <path d="M70 458 H 270 M70 450 v16 M170 450 v16 M270 450 v16 M340 458 H 500 M340 450 v16 M500 450 v16" className="draw__dim" />
        <text x="120" y="480" textAnchor="middle">20'-0"</text>
        <text x="220" y="480" textAnchor="middle">20'-0"</text>
        <text x="420" y="480" textAnchor="middle">32'-0"</text>
        <path d="M22 150 H 46 M22 290 H 46 M22 420 H 46" className="draw__dim" />
        <text x="46" y="144" textAnchor="end">T.O. steel</text>
        <text x="46" y="284" textAnchor="end">Level 2</text>
        <text x="46" y="414" textAnchor="end">Fin. floor</text>
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
