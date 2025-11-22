'use client';
import React from 'react';

interface GeographicMapProps {
  regions: { name: string; path: string }[];
  currentColoring?: { [key: string]: string };
  selectedRegion?: string;
}

const GeographicMap: React.FC<GeographicMapProps> = ({
  regions,
  currentColoring = {},
  selectedRegion
}) => {
  // Colores para el mapa (inspirados en mapas reales)
  const colorPalette = [
    '#FF6B6B', // Rojo
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    '#96CEB4', // Verde
    '#FFEAA7', // Amarillo
    '#DDA0DD', // Violeta
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black">Mapa Geográfico</h3>
      
      <div className="flex justify-center">
        <svg width="400" height="300" className="border border-gray-300 rounded bg-blue-50">
          {/* Dibujar todas las regiones */}
          {regions.map((region, index) => {
            const colorIndex = Object.keys(currentColoring).indexOf(region.name);
            const isSelected = selectedRegion === region.name;
            const hasColor = region.name in currentColoring;
            const fillColor = hasColor ? colorPalette[colorIndex % colorPalette.length] : '#f8fafc';
            const strokeColor = isSelected ? '#3b82f6' : '#475569';
            const strokeWidth = isSelected ? 3 : 1.5;

            return (
              <g key={`region-${region.name}`}>
                <path
                  d={region.path}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-300 cursor-pointer"
                />
                {/* Texto centrado en la región */}
                <text
                  x={200}
                  y={150 + (index * 10)}
                  textAnchor="middle"
                  className="font-bold text-sm pointer-events-none"
                  fill="#000000"
                  opacity={0.8}
                >
                  {region.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Leyenda de colores */}
      {Object.keys(currentColoring).length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-sm text-black">Colores asignados:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentColoring).map(([region, color], index) => (
              <div key={region} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                ></div>
                <span className="text-black">{region}: {color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographicMap;