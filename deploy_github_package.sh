echo "Creating publish config for $GITHUB_ACTOR"
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN\nregistry=https://npm.pkg.github.com/$GITHUB_ACTOR" > .npmrc
npm publish