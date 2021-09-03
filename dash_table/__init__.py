from dash.dash_table import *  # noqa: F401, F403, E402
from dash.dash_table import __version__  # noqa: F401, F403, E402y
import warnings

warnings.warn(
    """
The dash_table package is deprecated. Please replace
`import dash_table` with `from dash import dash_table`

Also, if you're using any of the table format helpers (e.g. Group), replace 
`from dash_table.Format import Group` with 
`from dash.dash_table.Format import Group`""",
    stacklevel=2,
)
