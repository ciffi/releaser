import initHusky from "./scripts/husky.js";
import updatePackageJson from "./scripts/package.js";
import addConfigurationFiles from "./scripts/configuration-files.js";
import { sampleFiles } from "./sample-files-data.js";

// Rendi i dati dei file di esempio disponibili globalmente
globalThis.sampleFiles = sampleFiles;

initHusky();
addConfigurationFiles();
updatePackageJson();
