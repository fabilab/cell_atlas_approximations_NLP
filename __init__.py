# coding: utf-8
"""Provides magically-named functions for python-package installation."""

import os.path

__version__ = '0.1.0'


def _jupyter_nbextension_paths():
    # src & dest are os paths, and so must use os.path.sep to work correctly on
    # Windows.
    # In contrast, require is a requirejs path, and thus must use `/` as the
    # path separator.
    return [dict(
        section='notebook',
        # src is relative to current module
        src=os.path.join('static', 'jupyterchat'),
        # dest directory is in the `nbextensions/` namespace
        dest='jupyterchat',
        # require is also in the `nbextensions/` namespace
        # must use / as path.sep
        require='jupyterchat/index',
    )]
