#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

echo "Copying icons"
cp -R "$1/packages/icon-kit/icons" "$1/packages/icon-kit/docs/public"

exit 0