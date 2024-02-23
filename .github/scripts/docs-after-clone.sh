#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Installing root npm"
npm --prefix $1 install

echo "Running root build"
npm run --prefix $1 build

echo "Building figma"
npm run --prefix $1 start

echo "Copying icons"
cp -R "$1/icons" "$1/docs/public"