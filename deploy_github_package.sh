echo "Creating publish config for $GITHUB_ACTOR"
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN2\nregistry=https://npm.pkg.github.com/$GITHUB_ACTOR" > .npmrc
cat ./npmrc
npm publish