const fs = require("fs");
const source = require('./package.json');
let buildPwa = false
let githubPackageRepository = false

if (process.argv.length > 2) {
    const args = process.argv.slice(2);
    buildPwa = args.includes("pwa");
    githubPackageRepository = args.includes("github-repository");
}
console.log("Converting package" + (buildPwa ? " with pwa" : ""));
const modified = Object.assign({}, source);
modified.dependencies = [];
modified.devDependencies = [];
modified.scripts = {
    start: 'echo "null"'
}
if (githubPackageRepository) {
    console.log("Publish to Github Repository");
    if (modified.publishConfig === undefined) {
        modified.publishConfig = {};
    }
    modified.publishConfig.registry = "https://npm.pkg.github.com/";
}
if (buildPwa === true)
    modified.name = modified.name + "-pwa";
fs.writeFileSync('./publish-package.json', JSON.stringify(modified, undefined, 4));