/**
 * Adds the pug-loader inside Angular CLI's webpack config, if not there yet.
 * @see https://github.com/danguilherme/ng-cli-pug-loader
 */
const fs = require('fs');
const commonCliConfig = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/typescript.js';
const pugRules = `directTemplateLoading: false,`;
const pugRules2 = `directTemplateLoading: true,`;
const tagName = "directTemplateLoading";
const tagNameLength = tagName.length;

fs.readFile(commonCliConfig, (err, data) => {
  if (err) throw err;

  const configText = data.toString();
  // make sure we don't add the rule if it already exists
  if (configText.indexOf(pugRules) > -1) { return; }
  const tagPosition = configText.indexOf(tagName);
  if (tagPosition <= -1) {
    console.log("Not found", tagPosition, configText.indexOf("directTemplateLoading"));
    return;
  }

  // Insert the pug webpack rule
  const position = configText.indexOf(pugRules2) + "directTemplateLoading: ".length;
  const output = [configText.slice(0, position), "false", configText.slice(position + 4)].join('');
  const file = fs.openSync(commonCliConfig, 'r+');
  fs.writeFile(file, output, error => {
    if (error)
      console.error("An error occurred while overwriting Angular CLI's Webpack config");

    fs.close(file, () => { });
  });
});
