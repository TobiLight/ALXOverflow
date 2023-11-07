#!/usr/bin/python3
"""ALX Overflow Application"""
from flask import Flask
from os import environ

app = Flask(__name__)


if __name__ == "__main__":
    """ Main Function """
    host = environ.get('ALXO_API_HOST')
    port = environ.get('ALXO_API_PORT')
    debug = environ.get("ALXO_DEBUG")
    if not host:
        host = '0.0.0.0'
    if not port:
        port = '5000'
    if not debug:
        debug = False
    app.run(host=host, port=port, threaded=True, debug=debug)
