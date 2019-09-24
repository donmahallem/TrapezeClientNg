const fs = require("fs");
const source = require('./package.json');
const buildPwa = (process.argv.length === 3 && process.argv[2] === "pwa");

console.log("Converting package" + (buildPwa ? " with pwa" : ""));
const modified = Object.assign({}, source);
modified.dependencies = [];
modified.devDependencies = [];
modified.scripts = {
    start: 'echo "null"'
}
modified.publishConfig.registry = "https://npm.pkg.github.com/";
if (buildPwa === true)
    modified.name = modified.name + "-pwa";
fs.writeFileSync('./publish-package.json', JSON.stringify(modified, undefined, 4));