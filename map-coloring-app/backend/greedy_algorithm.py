class GreedyMapColoring:
    def __init__(self, regions, adjacencies, colors):
        self.regions = regions
        self.adjacencies = adjacencies
        self.colors = colors
        self.adjacency_dict = self._build_adjacency_dict()
        self.steps = []
        
    def _build_adjacency_dict(self):
        adj_dict = {region: [] for region in self.regions}
        for adj in self.adjacencies:
            if len(adj) == 2:
                adj_dict[adj[0]].append(adj[1])
                adj_dict[adj[1]].append(adj[0])
        return adj_dict
    
    def solve(self):
        coloring = {}
        self.steps = []
        
        # Ordenar regiones por grado (número de vecinos)
        regions_by_degree = sorted(self.regions, 
                                 key=lambda r: len(self.adjacency_dict[r]), 
                                 reverse=True)
        
        for region in regions_by_degree:
            # Encontrar colores usados por vecinos
            used_colors = set()
            for neighbor in self.adjacency_dict[region]:
                if neighbor in coloring:
                    used_colors.add(coloring[neighbor])
            
            # Encontrar primer color disponible
            for color in self.colors:
                if color not in used_colors:
                    coloring[region] = color
                    self.steps.append({
                        "region": region,
                        "color": color,
                        "step_type": "assign",
                        "current_state": coloring.copy(),
                        "backtrack_reason": None
                    })
                    break
            else:
                # No se encontró color válido
                return {
                    "success": False,
                    "steps": self.steps,
                    "final_coloring": {},
                    "total_steps": len(self.steps),
                    "backtracks": 0
                }
        
        return {
            "success": True,
            "steps": self.steps,
            "final_coloring": coloring,
            "total_steps": len(self.steps),
            "backtracks": 0
        }