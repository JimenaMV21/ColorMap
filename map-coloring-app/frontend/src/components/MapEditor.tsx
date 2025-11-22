'use client';
import React, { useState } from 'react';

interface MapEditorProps {
  onMapChange: (map: { regions: string[]; adjacencies: string[][] }) => void;
  currentMap: { regions: string[]; adjacencies: string[][] };
}

const MapEditor: React.FC<MapEditorProps> = ({ onMapChange, currentMap }) => {
  const [newRegion, setNewRegion] = useState('');

  const addRegion = () => {
    if (newRegion && !currentMap.regions.includes(newRegion)) {
      const updatedRegions = [...currentMap.regions, newRegion];
      const updatedMap = { ...currentMap, regions: updatedRegions };
      onMapChange(updatedMap);
      setNewRegion('');
    }
  };

  const removeRegion = (region: string) => {
    const updatedRegions = currentMap.regions.filter(r => r !== region);
    const updatedAdjacencies = currentMap.adjacencies.filter(
      adj => !adj.includes(region)
    );
    const updatedMap = {
      regions: updatedRegions,
      adjacencies: updatedAdjacencies
    };
    onMapChange(updatedMap);
  };

  const toggleAdjacency = (region1: string, region2: string) => {
    const existingIndex = currentMap.adjacencies.findIndex(
      adj => (adj[0] === region1 && adj[1] === region2) || 
             (adj[0] === region2 && adj[1] === region1)
    );

    let updatedAdjacencies;
    if (existingIndex >= 0) {
      updatedAdjacencies = currentMap.adjacencies.filter((_, index) => index !== existingIndex);
    } else {
      updatedAdjacencies = [...currentMap.adjacencies, [region1, region2]];
    }

    const updatedMap = { ...currentMap, adjacencies: updatedAdjacencies };
    onMapChange(updatedMap);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Editor de Mapa</h3>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value.toUpperCase())}
            placeholder="Nombre de región"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={2}
          />
          <button
            onClick={addRegion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Regiones:</h4>
          <div className="flex flex-wrap gap-2">
            {currentMap.regions.map(region => (
              <div
                key={region}
                className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
              >
                <span>{region}</span>
                <button
                  onClick={() => removeRegion(region)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Definir Vecindades:</h4>
        <div className="grid grid-cols-2 gap-2">
          {currentMap.regions.map(region1 =>
            currentMap.regions.map(region2 =>
              region1 < region2 && (
                <button
                  key={`${region1}-${region2}`}
                  onClick={() => toggleAdjacency(region1, region2)}
                  className={`p-2 rounded border text-sm ${
                    currentMap.adjacencies.some(adj =>
                      (adj[0] === region1 && adj[1] === region2) ||
                      (adj[0] === region2 && adj[1] === region1)
                    )
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {region1} ↔ {region2}
                </button>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MapEditor;