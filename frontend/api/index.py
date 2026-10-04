import os
import sys
from pathlib import Path

# Add repository root to sys.path so 'backend' is importable
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.main import app
