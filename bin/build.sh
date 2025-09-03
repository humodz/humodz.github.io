#!/usr/bin/env bash
set -e

mkdir -p dist
cp -r css dist

node bin/markdown.js