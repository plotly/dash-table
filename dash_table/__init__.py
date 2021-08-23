from dash.dash_table import *  # noqa: F401, F403, E402
import warnings

warnings.warn(
    """
The dash_table package is deprecated. Please replace
`import dash_table` with `from dash import dash_table`""",
    stacklevel=2,
)
