'use client';
import React from 'react';

interface ColorControlsProps {
  onSolve: () => Promise<void>;
  maxColors: number;
  setMaxColors: (colors: number) => void;
  isSolving: boolean;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  onSolve,
  maxColors,
  setMaxColors,
  isSolving
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Configuración de Colores</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número máximo de colores:
        </label>
        <select
          value={maxColors}
          onChange={(e) => setMaxColors(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>
              {num} colores
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={onSolve}
        disabled={isSolving}
        className="w-full px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSolving ? 'Resolviendo...' : 'Resolver con Backtracking'}
      </button>
    </div>
  );
};

export default ColorControls;