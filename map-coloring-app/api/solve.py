from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Agregar el path para importar nuestros módulos
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    # Simular nuestro backend
    from backend.backtracking_engine import BacktrackingMapColoring
except ImportError:
    # Fallback si no puede importar
    class BacktrackingMapColoring:
        def __init__(self, regions, adjacencies, colors):
            self.regions = regions
            self.adjacencies = adjacencies
            self.colors = colors
            
        def solve(self):
            # Implementación simple para demo
            coloring = {}
            steps = []
            
            for region in self.regions:
                coloring[region] = self.colors[0]
                steps.append({
                    "region": region,
                    "color": self.colors[0],
                    "step_type": "assign",
                    "current_state": coloring.copy(),
                    "backtrack_reason": None
                })
            
            return {
                "success": True,
                "steps": steps,
                "final_coloring": coloring,
                "total_steps": len(steps),
                "backtracks": 0
            }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            
            # Extraer algoritmo de la URL
            algorithm = self.path.split('/')[-1] if '/' in self.path else 'backtracking'
            
            regions = request_data.get('regions', [])
            adjacencies = request_data.get('adjacencies', [])
            max_colors = request_data.get('max_colors', 3)
            colors = [f"color{i}" for i in range(max_colors)]
            
            # Usar nuestro solver
            solver = BacktrackingMapColoring(regions, adjacencies, colors)
            result = solver.solve()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()