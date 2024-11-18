#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const rootPath = path.resolve(process.env.INIT_CWD || process.cwd());
const huskyHiddenPath = path.resolve(rootPath, ".husky");
const gitIgnorePath = path.resolve(rootPath, ".gitignore");
const huskyIgnoreString = ".husky";
const packageJsonFile = path.resolve(rootPath, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf8"));

function addHuskyToGitIgnore() {
  if (!fs.existsSync(gitIgnorePath)) {
    fs.writeFileSync(gitIgnorePath, huskyIgnoreString);
  } else {
    const gitignore = fs.readFileSync(gitIgnorePath, "utf8");
    if (!gitignore.includes(huskyIgnoreString)) {
      fs.appendFileSync(gitIgnorePath, `\n${huskyIgnoreString}`);
    }
  }
}

if (!fs.existsSync(huskyHiddenPath)) {
  exec(`npx husky init`, { cwd: rootPath }, () => {
    exec(`echo npx commitlint --edit $1 > ${huskyHiddenPath}/commit-msg`, {
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
            pushTag: "git push --follow-tags",
          },
          commitlint: {
            extends: ["@commitlint/config-conventional"],
          },
          "auto-changelog": {
            hideCredit: true,
            template: "compact",
            commitLimit: false,
          },
        },
        null,
        2
      ),
      "utf8"
    );
    addHuskyToGitIgnore();
  });
} else {
  console.log("husky init already done");
}

