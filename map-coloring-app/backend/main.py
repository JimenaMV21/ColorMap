from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import MapRequest, ColoringSolution
from backtracking_engine import BacktrackingMapColoring
import sys
import os

sys.path.append(os.path.dirname(__file__))

app = FastAPI(title="Map Coloring Backtracking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/solve/{algorithm}", response_model=ColoringSolution)
async def solve_map_coloring(algorithm: str, request: MapRequest):
    try:
        colors = request.colors if request.colors else [f"color{i}" for i in range(request.max_colors)]
        
        if algorithm == "backtracking":
            solver = BacktrackingMapColoring(
                regions=request.regions,
                adjacencies=request.adjacencies,
                colors=colors
            )
        elif algorithm == "greedy":
            solver = GreedyMapColoring(
                regions=request.regions,
                adjacencies=request.adjacencies,
                colors=colors
            )
        elif algorithm == "forward_checking":
            solver = ForwardCheckingColoring(
                regions=request.regions,
                adjacencies=request.adjacencies,
                colors=colors
            )
        else:
            raise HTTPException(status_code=400, detail="Algoritmo no soportado")
        
        result = solver.solve()
        return ColoringSolution(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)