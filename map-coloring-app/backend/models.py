from pydantic import BaseModel
from typing import List, Dict, Optional

class MapRequest(BaseModel):
    regions: List[str]
    adjacencies: List[List[str]]
    colors: List[str]
    max_colors: int

class ColoringStep(BaseModel):
    region: str
    color: str
    step_type: str
    current_state: Dict[str, str]
    backtrack_reason: Optional[str] = None

class ColoringSolution(BaseModel):
    success: bool
    steps: List[ColoringStep]
    final_coloring: Dict[str, str]
    total_steps: int
    backtracks: int