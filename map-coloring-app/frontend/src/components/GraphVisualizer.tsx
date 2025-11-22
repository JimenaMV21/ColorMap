'use client';
import React from 'react';

interface GraphVisualizerProps {
  regions: string[];
  adjacencies: string[][];
  currentColoring?: { [key: string]: string };
  selectedRegions?: string[];
}

// Definir tipos para las formas
interface CircleShape {
  x: number;
  y: number;
  type: 'circle';
  r: number;
}

interface RectShape {
  x: number;
  y: number;
  type: 'rect';
  width: number;
  height: number;
}

type Shape = CircleShape | RectShape;

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  regions,
  adjacencies,
  currentColoring = {},
  selectedRegions = []
}) => {
  // Colores disponibles para mostrar
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  // Coordenadas y formas predefinidas para cada región
  const getRegionShape = (region: string): Shape => {
    const shapes: { [key: string]: Shape } = {
      // Para mapa simple (4 regiones)
      'A': { x: 100, y: 100, type: 'rect', width: 80, height: 60 },
      'B': { x: 200, y: 100, type: 'circle', r: 40 },
      'C': { x: 200, y: 200, type: 'rect', width: 80, height: 60 },
      'D': { x: 100, y: 200, type: 'circle', r: 40 },
      
      // Para mapa complejo (6 regiones)
      '1': { x: 80, y: 80, type: 'rect', width: 70, height: 50 },
      '2': { x: 180, y: 80, type: 'circle', r: 35 },
      '3': { x: 250, y: 150, type: 'rect', width: 70, height: 50 },
      '4': { x: 180, y: 220, type: 'circle', r: 35 },
      '5': { x: 80, y: 220, type: 'rect', width: 70, height: 50 },
      '6': { x: 150, y: 150, type: 'circle', r: 35 },
      
      // Para triángulo
      'X': { x: 150, y: 80, type: 'rect', width: 70, height: 50 },
      'Y': { x: 80, y: 180, type: 'circle', r: 35 },
      'Z': { x: 220, y: 180, type: 'rect', width: 70, height: 50 }
    };

    // Mapeo de regiones a las formas predefinidas
    const regionMapping: { [key: string]: string } = {
      'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D',
      '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
      'X': 'X', 'Y': 'Y', 'Z': 'Z'
    };

    const shapeKey = regionMapping[region] || 'A';
    return shapes[shapeKey] || shapes['A'];
  };

  // Encontrar coordenadas de una región para las líneas
  const getRegionCenter = (region: string) => {
    const shape = getRegionShape(region);
    if (shape.type === 'circle') {
      return { x: shape.x, y: shape.y };
    } else {
      return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Mapa Visual</h3>
      
      <div className="flex justify-center">
        <svg width="320" height="320" className="border border-gray-200 rounded bg-gray-50">
          {/* Dibujar líneas de vecindades */}
          {adjacencies.map((adj, index) => {
            const [region1, region2] = adj;
            const center1 = getRegionCenter(region1);
            const center2 = getRegionCenter(region2);
            
            return (
              <line
                key={`edge-${index}`}
                x1={center1.x}
                y1={center1.y}
                x2={center2.x}
                y2={center2.y}
                stroke="#94a3b8"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            );
          })}
          
          {/* Dibujar regiones como figuras */}
          {regions.map((region) => {
            const shape = getRegionShape(region);
            const colorIndex = Object.keys(currentColoring).indexOf(region);
            const isSelected = selectedRegions.includes(region);
            const hasColor = region in currentColoring;
            const fillColor = hasColor ? colorPalette[colorIndex % colorPalette.length] : '#f1f5f9';
            const strokeColor = isSelected ? '#3b82f6' : '#64748b';
            const strokeWidth = isSelected ? 3 : 2;

            return (
              <g key={`region-${region}`}>
                {shape.type === 'circle' ? (
                  <>
                    <circle
                      cx={shape.x}
                      cy={shape.y}
                      r={shape.r}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      className="transition-all duration-200"
                    />
                    <text
                      x={shape.x}
                      y={shape.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold text-sm pointer-events-none"
                      fill="#000000"
                    >
                      {region}
                    </text>
                    {/* Etiqueta del color asignado para círculos */}
                    {hasColor && (
                      <text
                        x={shape.x}
                        y={shape.y + shape.r + 15}
                        textAnchor="middle"
                        className="text-xs font-medium pointer-events-none"
                        fill="#64748b"
                      >
                        {currentColoring[region]}
                      </text>
                    )}
                  </>
                ) : (
                  <>
                    <rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      rx="8"
                      className="transition-all duration-200"
                    />
                    <text
                      x={shape.x + shape.width / 2}
                      y={shape.y + shape.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold text-sm pointer-events-none"
                      fill="#000000"
                    >
                      {region}
                    </text>
                    {/* Etiqueta del color asignado para rectángulos */}
                    {hasColor && (
                      <text
                        x={shape.x + shape.width / 2}
                        y={shape.y + shape.height + 15}
                        textAnchor="middle"
                        className="text-xs font-medium pointer-events-none"
                        fill="#64748b"
                      >
                        {currentColoring[region]}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Leyenda de colores */}
      {Object.keys(currentColoring).length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-sm">Colores asignados:</h4>
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

export default GraphVisualizer;