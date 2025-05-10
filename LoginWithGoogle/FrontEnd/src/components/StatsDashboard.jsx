import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { getCountriesByRegion } from '../services/api';

const REGION_COORDS = {
  Asia:         { lat: 39.9,  lng: 32.9 },
  Europe:       { lat: 51.5,  lng: -0.1 },
  Africa:       { lat: 0.0,   lng: 20.0 },
  'N. America': { lat: 40.7,  lng: -74.0 },
  'S. America': { lat: -15.8, lng: -47.9 },
  Oceania:      { lat: -25.3, lng: 133.8 },
};

const GLOBAL_STATS = {
  'Unique Humans':       12446947,
  'Tokens Distributed':  552585740,
  'New Accounts':        236550,
  'Daily Transactions':  1384256,
  'Total Transactions':  365846686,
  'World App Users':     26547960,
  Verifications:         84231,
  'Countries With Users':'160+',
  'Active Orbs':         1569,
};

const REGION_DATA = {
  Asia: {
    'Unique Humans':      2433418,
    'World App Users':    6199070,
    'Tokens Distributed': 70939783,
    'Wallet Transactions':9665485,
    'Active Orbs':        502,
  },
  Europe: {
    'Unique Humans':      1331138,
    'World App Users':    2565116,
    'Tokens Distributed': 85468226,
    'Wallet Transactions':14711730,
    'Active Orbs':        128,
  },
  Africa: {
    'Unique Humans':      538901,
    'World App Users':    1543882,
    'Tokens Distributed': 26068233,
    'Wallet Transactions':6819891,
    'Active Orbs':        368,
  },
  'N. America': {
    'Unique Humans':      827385,
    'World App Users':    1709520,
    'Tokens Distributed': 27420877,
    'Wallet Transactions':4898983,
    'Active Orbs':        572,
  },
  'S. America': {
    'Unique Humans':      7085264,
    'World App Users':    14288889,
    'Tokens Distributed': 334852806,
    'Wallet Transactions':83480150,
    'Active Orbs':        572,
  },
  Oceania: {
    'Unique Humans':      22,
    'World App Users':    20365,
    'Tokens Distributed': 1703,
    'Wallet Transactions':569,
    'Active Orbs':        20,
  },
};

export default function StatsDashboard() {
  const globeEl = useRef();
  const [overlay, setOverlay] = useState(null);
  const [regionCountries, setRegionCountries] = useState([]);

  useEffect(() => {
    const controls = globeEl.current?.controls();
    if (controls) {
      controls.enableZoom = true;
      controls.enablePan  = false;
    }
  }, []);

  const regionMarkers = Object.keys(REGION_DATA).map(name => ({
    label: name,
    ...REGION_COORDS[name],
    isRegion: true,
  }));

  const onPointClick = async pt => {
    if (!pt.isRegion) return;
    setOverlay({
      lat: REGION_COORDS[pt.label].lat,
      lng: REGION_COORDS[pt.label].lng,
      name: pt.label,
      stats: REGION_DATA[pt.label],
    });
    try {
      const countries = await getCountriesByRegion(pt.label);
      setRegionCountries(countries.map(c => ({
        lat: c.latlng[0],
        lng: c.latlng[1],
        label: c.name.common,
        isCountry: true,
      })));
    } catch {
      setRegionCountries([]);
    }
  };

  const closeOverlay = () => {
    setOverlay(null);
    setRegionCountries([]);
  };

  // Determine stats for card
  const statsToShow = overlay ? overlay.stats : GLOBAL_STATS;
  const title = overlay ? overlay.name : 'Global';

  return (
    <section className="w-full mb-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        Global Stats Overview
      </h2>

      <div  className="relative rounded-lg overflow-hidden"
          style={{ width: '1440px', height: '600px' }}>
        <Globe
          ref={globeEl}
          width={1440}
          height={600}
          style={{ width: '100%', height: '100%' }}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          pointsData={[...regionMarkers, ...regionCountries]}
          pointLat="lat"
          pointLng="lng"
          pointColor={d => d.isCountry ? 'orange' : 'cyan'}
          pointRadius={d => d.isCountry ? 0.1 : 0.3}
          onPointClick={onPointClick}
        />

        {/* Overlay stats card on top-right of the globe */}
        <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs pointer-events-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            {overlay && (
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={closeOverlay}
              >
                ✕
              </button>
            )}
          </div>
          <ul className="space-y-2 text-sm">
            {Object.entries(statsToShow).map(([label, val]) => (
              <li key={label} className="flex justify-between">
                <span>{label}</span>
                <span className="font-medium">
                  {typeof val === 'number' ? val.toLocaleString() : val}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
