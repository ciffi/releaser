#! /usr/bin/env node
import initHusky from "./src/scripts/husky.js";
import updatePackageJson from "./src/scripts/package.js";
import addConfigurationFiles from "./src/scripts/configuration-files.js";

initHusky();
addConfigurationFiles();
updatePackageJson();