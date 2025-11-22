class BacktrackingMapColoring:
    def __init__(self, regions, adjacencies, colors):
        self.regions = regions
        self.adjacencies = adjacencies
        self.colors = colors
        self.adjacency_dict = self._build_adjacency_dict()
        self.steps = []
        self.backtrack_count = 0
        
    def _build_adjacency_dict(self):
        adj_dict = {region: [] for region in self.regions}
        for adj in self.adjacencies:
            if len(adj) == 2:
                adj_dict[adj[0]].append(adj[1])
                adj_dict[adj[1]].append(adj[0])
        return adj_dict
    
    def is_valid_color(self, region, color, coloring):
        for neighbor in self.adjacency_dict[region]:
            if neighbor in coloring and coloring[neighbor] == color:
                return False
        return True
    
    def solve(self):
        coloring = {}
        self.steps = []
        self.backtrack_count = 0
        
        def backtrack(current_region_index):
            if current_region_index == len(self.regions):
                return True
                
            region = self.regions[current_region_index]
            
            for color in self.colors:
                if self.is_valid_color(region, color, coloring):
                    coloring[region] = color
                    self.steps.append({
                        "region": region,
                        "color": color,
                        "step_type": "assign",
                        "current_state": coloring.copy(),
                        "backtrack_reason": None
                    })
                    
                    if backtrack(current_region_index + 1):
                        return True
                    
                    del coloring[region]
                    self.backtrack_count += 1
                    self.steps.append({
                        "region": region,
                        "color": color,
                        "step_type": "backtrack",
                        "current_state": coloring.copy(),
                        "backtrack_reason": f"Conflicto futuro con color {color}"
                    })
                else:
                    self.steps.append({
                        "region": region,
                        "color": color,
                        "step_type": "conflict",
                        "current_state": coloring.copy(),
                        "backtrack_reason": f"Color {color} no válido por vecinos"
                    })
            
            return False
        
        success = backtrack(0)
        return {
            "success": success,
            "steps": self.steps,
            "final_coloring": coloring if success else {},
            "total_steps": len(self.steps),
            "backtracks": self.backtrack_count
        }