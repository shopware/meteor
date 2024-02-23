#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Installing root npm"
pnpm -C $1 i

echo "Running root build"
pnpm -C $1 --filter "*/meteor-icon-kit" build

echo "Building figma"
pnpm -C $1 --filter "*/meteor-icon-kit" start

echo "Copying icons"
cp -R "$1/packages/icon-kit/icons" "$1/packages/icon-kit/docs/public"