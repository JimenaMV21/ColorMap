'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AnimationControls from '@/components/AnimationControls';
import StepVisualizer from '@/components/StepVisualizer';
import GeographicMap from '@/components/GeographicMap';

interface Step {
  region: string;
  color: string;
  step_type: string;
  current_state: { [key: string]: string };
  backtrack_reason?: string;
}

interface Solution {
  success: boolean;
  steps: Step[];
  final_coloring: { [key: string]: string };
  total_steps: number;
  backtracks: number;
}

// Mapa geográfico fijo con formas irregulares (como el teorema original)
const FIXED_GEOGRAPHIC_MAP = {
  name: "Mapa de los 4 Colores",
  description: "Mapa que requiere exactamente 4 colores - Demostración del Teorema",
  regions: [
    {
      name: "A",
      path: "M50,50 L150,30 L250,70 L230,150 L150,170 L70,130 Z"
    },
    {
      name: "B", 
      path: "M250,70 L350,50 L380,120 L320,180 L230,150 Z"
    },
    {
      name: "C",
      path: "M150,170 L230,150 L320,180 L280,250 L180,230 L120,190 Z"
    },
    {
      name: "D",
      path: "M50,50 L70,130 L120,190 L80,250 L30,180 L20,100 Z"
    },
    {
      name: "E",
      path: "M70,130 L150,170 L120,190 L80,250 Z"
    },
    {
      name: "F",
      path: "M230,150 L320,180 L280,250 L180,230 Z"
    }
  ],
  adjacencies: [
    ['A', 'B'], ['A', 'C'], ['A', 'D'], ['A', 'E'],
    ['B', 'C'], ['B', 'F'],
    ['C', 'D'], ['C', 'E'], ['C', 'F'],
    ['D', 'E'],
    ['E', 'F']
  ]
};

// Algoritmos disponibles
const ALGORITHMS = {
  backtracking: {
    name: "Forma 1: Backtracking",
    description: "Algoritmo de fuerza bruta con retroceso. Prueba todas las combinaciones y retrocede cuando encuentra conflictos."
  },
  greedy: {
    name: "Forma 2: Algoritmo Voraz", 
    description: "Asigna colores en orden, seleccionando el primer color disponible sin considerar consecuencias futuras."
  },
  forward_checking: {
    name: "Forma 3: Forward Checking",
    description: "Mejora del backtracking que verifica restricciones futuras antes de asignar colores."
  }
};

export default function Home() {
  const [maxColors, setMaxColors] = useState(4);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [isSolving, setIsSolving] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('backtracking');

  const solveMap = useCallback(async (algorithm: string) => {
    setIsSolving(true);
    try {
      const response = await fetch(`/api/solve/${algorithm}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regions: FIXED_GEOGRAPHIC_MAP.regions.map(r => r.name),
          adjacencies: FIXED_GEOGRAPHIC_MAP.adjacencies,
          colors: [],
          max_colors: maxColors
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result: Solution = await response.json();
      setSolution(result);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error solving map:', error);
      alert('Error al resolver el mapa. Asegúrate de que el backend esté ejecutándose en http://localhost:8000');
    } finally {
      setIsSolving(false);
    }
  }, [maxColors]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && solution && currentStep < solution.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < solution.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, solution, currentStep, speed]);

  const getCurrentStepData = () => {
    if (!solution || currentStep >= solution.steps.length) {
      return { current_state: {} };
    }
    return solution.steps[currentStep];
  };

  const getSelectedRegion = () => {
    if (!solution || currentStep >= solution.steps.length) {
      return undefined;
    }
    return solution.steps[currentStep].region;
  };

  const currentAlgorithm = ALGORITHMS[selectedAlgorithm as keyof typeof ALGORITHMS];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🗺️ Teorema de los 4 Colores
          </h1>
          <p className="text-gray-600">
            Demostración interactiva - Cualquier mapa plano puede colorearse con 4 colores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Controles */}
          <div className="space-y-6">
            {/* Información del teorema */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-black">El Teorema</h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Teorema de los cuatro colores:</strong> Cualquier mapa geográfico plano puede ser coloreado usando solo cuatro colores, de forma que no haya dos regiones adyacentes del mismo color.
              </p>
              <div className="text-xs text-gray-600">
                <p className="font-medium text-black"> Este mapa demuestra:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Con 3 colores:  Imposible</li>
                  <li>• Con 4 colores:  Posible</li>
                  <li>• Con 5 colores:  Posible (pero innecesario)</li>
                </ul>
              </div>
            </div>

            {/* Configuración de colores */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-black">Configuración</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de colores a usar:
                </label>
                <select
                  value={maxColors}
                  onChange={(e) => setMaxColors(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value={2}>2 colores</option>
                  <option value={3}>3 colores</option>
                  <option value={4}>4 colores</option>
                  <option value={5}>5 colores</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium text-black"> Recomendación:</p>
                <p>Prueba con 3 colores para ver por qué falla, luego con 4 para ver la solución.</p>
              </div>
            </div>

            {/* Selección de algoritmo */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-black">Métodos de Solución</h3>
              
              <div className="space-y-3">
                {Object.entries(ALGORITHMS).map(([key, algo]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <button
                      onClick={() => setSelectedAlgorithm(key)}
                      className={`w-full text-left font-medium ${
                        selectedAlgorithm === key ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {algo.name}
                    </button>
                    <p className="text-xs text-gray-600 mt-1">
                      {algo.description}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => solveMap(selectedAlgorithm)}
                disabled={isSolving}
                className="w-full mt-4 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSolving ? 'Resolviendo...' : `Resolver con ${currentAlgorithm.name.split(':')[1]}`}
              </button>
            </div>
          </div>

          {/* Panel central - Mapa geográfico */}
          <div className="space-y-6">
            <GeographicMap
              regions={FIXED_GEOGRAPHIC_MAP.regions}
              currentColoring={getCurrentStepData().current_state}
              selectedRegion={getSelectedRegion()}
            />

            {solution && (
              <AnimationControls
                currentStep={currentStep}
                totalSteps={solution.steps.length}
                isPlaying={isPlaying}
                speed={speed}
                onStepChange={setCurrentStep}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onSpeedChange={setSpeed}
                onReset={() => setCurrentStep(0)}
              />
            )}
          </div>

          {/* Panel derecho - Información */}
          <div className="space-y-6">
            {solution ? (
              <>
                <StepVisualizer
                  step={solution.steps[currentStep]}
                  currentStep={currentStep}
                  totalSteps={solution.steps.length}
                  finalSolution={solution.final_coloring}
                />

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-black">Resultados</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-black">Algoritmo:</span>{' '}
                      <span className="text-black">{currentAlgorithm.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Pasos:</span>{' '}
                      <span className="text-black">{solution.total_steps}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Retrocesos:</span>{' '}
                      <span className="text-black">{solution.backtracks}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Colores usados:</span>{' '}
                      <span className="text-black">{maxColors}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-black">Solución:</span>{' '}
                      <span className={`font-bold ${solution.success ? 'text-green-600' : 'text-red-600'}`}>
                        {solution.success ? 'ENCONTRADA' : 'NO ENCONTRADA'}
                      </span>
                    </div>
                    {!solution.success && (
                      <div className="col-span-2 text-xs text-red-600">
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold mb-2 text-black">Demostración Interactiva</h3>
                <p className="text-gray-700 mb-4">
                  Selecciona un método de solución y haz clic en "Resolver" para ver el algoritmo en acción.
                </p>
                <div className="text-sm text-gray-600 text-left">
                  <p className="text-black font-medium">Objetivos de aprendizaje:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Comprender por qué algunos mapas requieren 4 colores</li>
                    <li>• Comparar diferentes algoritmos de coloreo</li>
                    <li>• Visualizar el proceso de backtracking</li>
                    <li>• Verificar el teorema de los 4 colores</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}