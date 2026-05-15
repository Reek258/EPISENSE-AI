import json
import os
import threading
from typing import Any

# Use locks to prevent concurrent write issues in JSON files
_locks: dict[str, threading.Lock] = {}

def _get_lock(filename: str) -> threading.Lock:
    if filename not in _locks:
        _locks[filename] = threading.Lock()
    return _locks[filename]

def read_json(filepath: str) -> Any:
    """Read a JSON file and return its contents."""
    if not os.path.exists(filepath):
        return []
        
    with _get_lock(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []

def write_json(filepath: str, data: Any) -> None:
    """Write data to a JSON file safely."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    with _get_lock(filepath):
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
