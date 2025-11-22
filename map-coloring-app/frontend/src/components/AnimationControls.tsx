'use client';
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface AnimationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onStepChange,
  onPlayPause,
  onSpeedChange,
  onReset
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Control de Animación</h3>
      
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => onStepChange(0)}
          disabled={currentStep === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Ir al inicio"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Paso anterior"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={() => onStepChange(currentStep + 1)}
          disabled={currentStep === totalSteps - 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Paso siguiente"
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStep === totalSteps - 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Ir al final"
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={onReset}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Reiniciar"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Velocidad de animación:
        </label>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2000}>Muy Lenta</option>
          <option value={1000}>Lenta</option>
          <option value={500}>Normal</option>
          <option value={200}>Rápida</option>
          <option value={100}>Muy Rápida</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progreso:</span>
          <span>{currentStep + 1} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;