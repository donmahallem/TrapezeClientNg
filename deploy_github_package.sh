#!/bin/sh
echo "Creating publish config for $GITHUB_ACTOR"
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN2
registry=https://npm.pkg.github.com/$GITHUB_ACTOR" > .npmrc
ls
cat ./npmrc
npm publish