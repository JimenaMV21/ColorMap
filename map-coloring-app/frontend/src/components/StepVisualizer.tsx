'use client';
import React from 'react';

interface Step {
  region: string;
  color: string;
  step_type: string;
  current_state: { [key: string]: string };
  backtrack_reason?: string;
}

interface StepVisualizerProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  finalSolution?: { [key: string]: string };
}

const StepVisualizer: React.FC<StepVisualizerProps> = ({
  step,
  currentStep,
  totalSteps,
  finalSolution
}) => {
  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'assign': return 'bg-green-100 border-green-500 text-green-800';
      case 'backtrack': return 'bg-red-100 border-red-500 text-red-800';
      case 'conflict': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getStepTypeText = (type: string) => {
    switch (type) {
      case 'assign': return 'ASIGNACIÓN';
      case 'backtrack': return 'RETROCESO';
      case 'conflict': return 'CONFLICTO';
      default: return type;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Paso {currentStep + 1} de {totalSteps}
      </h3>
      
      <div className={`border-2 rounded-lg p-4 mb-4 ${getStepTypeColor(step.step_type)}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">{getStepTypeText(step.step_type)}</span>
          <span className="text-sm">Región: <strong>{step.region}</strong></span>
        </div>
        
        <div className="mb-2">
          <span className="font-medium">Color probado:</span>{' '}
          <span className="px-2 py-1 bg-blue-100 rounded">{step.color}</span>
        </div>
        
        {step.backtrack_reason && (
          <div className="mt-2 p-2 bg-orange-100 rounded text-sm">
            <strong>Razón:</strong> {step.backtrack_reason}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Estado actual del coloreo:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(step.current_state).map(([region, color]) => (
            <div
              key={region}
              className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"
            >
              <span className="font-medium">{region}</span>
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>{color}</span>
            </div>
          ))}
          {Object.keys(step.current_state).length === 0 && (
            <span className="text-gray-500">Sin colores asignados</span>
          )}
        </div>
      </div>

      {finalSolution && Object.keys(finalSolution).length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">¡Solución encontrada!</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(finalSolution).map(([region, color]) => (
              <div
                key={region}
                className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full"
              >
                <span className="font-medium">{region}</span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepVisualizer;