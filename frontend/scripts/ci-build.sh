#!/bin/bash

# This script is used only in CI environments to work around
# the Rollup optional dependency issue on Linux

# Set environment variable to skip native Rollup plugin
export ROLLUP_SKIP_LOAD_NATIVE_PLUGIN=true

# Run the standard build command
npm run build 