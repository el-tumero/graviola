import os, json
from pathlib import Path


def get_abs_path(rel_path: str) -> str:
    script_dir = Path(__file__).resolve().parent.parent
    abs_path = os.path.join(script_dir, rel_path)
    return abs_path


def read_json(abs_path: str):
    try:
        with open(abs_path) as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"file '{abs_path}' was not found.")
    except json.JSONDecodeError:
        raise ValueError(f"file {abs_path}' is not a json file.")
