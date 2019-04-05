const fs = require("fs");
const source = require('./package.json');

console.log(source);
const modified = Object.assign({}, source);
modified.dependencies = [];
modified.devDependencies = [];
modified.scripts = {
    start: 'echo "null"'
}
fs.writeFileSync('./publish-package.json', JSON.stringify(modified, undefined, 4));