import io
from setuptools import setup

setup(
    name="dash_table",
    version="5.0.0rc1",
    author="Chris Parmer <chris@plotly.com>",
    packages=["dash_table"],
    include_package_data=True,
    license="MIT",
    description="Dash table",
    long_description=io.open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    install_requires=[],
)
