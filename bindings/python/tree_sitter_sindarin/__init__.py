"""Tree-sitter grammar for Sindarin."""

from importlib.resources import files as _files

from ._binding import language


def _get_query(name: str, filename: str) -> str:
    """Get a query from the queries directory."""
    query_path = _files(__package__) / "queries" / filename
    try:
        return query_path.read_text()
    except FileNotFoundError:
        return ""


__all__ = ["language"]
