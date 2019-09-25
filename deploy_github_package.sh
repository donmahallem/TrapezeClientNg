#!/bin/sh
echo "Creating publish config for $GITHUB_ACTOR"
npm config set "//npm.pkg.github.com/:_authToken" "$GITHUB_TOKEN"
npm publish -reg "https://npm.pkg.github.com/$GITHUB_ACTOR"