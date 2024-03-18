#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const rootPath = path.resolve(process.env.INIT_CWD || process.cwd());
const huskyHiddenPath = path.resolve(rootPath, ".husky");
const packageJsonFile = path.resolve(rootPath, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf8"));

if (!fs.existsSync(huskyHiddenPath)) {
  exec(`npx husky init`, { cwd: rootPath }, () => {
    exec(`echo npm commitlint --edit $1 > ${huskyHiddenPath}/commit-msg`, {
      cwd: rootPath,
    });
    exec(`echo > ${huskyHiddenPath}/pre-commit`, { cwd: rootPath });
    fs.writeFileSync(
      packageJsonFile,
      JSON.stringify(
        {
          ...packageJson,
          scripts: {
            ...packageJson.scripts,
            version: "auto-changelog -p && git add CHANGELOG.md",
          },
          commitlint: {
            extends: ["@commitlint/config-conventional"],
          },
          "auto-changelog": {
            hideCredit: true,
            template: "compact",
          },
        },
        null,
        2
      ),
      "utf8"
    );
  });
} else {
  console.log("husky init already done");
}

