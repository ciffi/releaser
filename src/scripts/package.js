#! /usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const rootPath = resolve(process.env.INIT_CWD || process.cwd());
const packageJsonFile = resolve(rootPath, "package.json");

function updatePackageJson() {
    console.log('\n📝 Aggiornamento del file package.json...');
    
    try {
        // Verifica se il file package.json esiste
        if (!existsSync(packageJsonFile)) {
            console.error(`❌ File package.json non trovato in ${rootPath}`);
            return;
        }
        
        // Leggi il file package.json
        const packageJsonContent = readFileSync(packageJsonFile, "utf8");
        let packageJson;
        
        try {
            packageJson = JSON.parse(packageJsonContent);
        } catch (parseError) {
            console.error(`❌ Errore durante il parsing del file package.json: ${parseError.message}`);
            return;
        }
        
        // Crea una copia del package.json originale per confronto
        const originalPackageJson = JSON.stringify(packageJson);
        
        // Aggiorna il package.json
        const updatedPackageJson = {
            ...packageJson,
            scripts: {
                ...packageJson.scripts,
                lint: "prettier --write . && tsc --noEmit -p tsconfig.json && next lint --fix",
                version: "auto-changelog -p && git add CHANGELOG.md",
                "push-tags": "git push --follow-tags",
            },
            commitlint: {
                extends: ["@commitlint/config-conventional"],
            },
            "auto-changelog": {
                hideCredit: true,
                template: "compact",
                commitLimit: false,
            },
            "lint-staged": {
                "*.{ts,tsx,js,jsx}": [
                    "prettier --write",
                    "lint-staged-tsc",
                    "eslint --fix"
                ],
                "*.md": "prettier --write"
            }
        };
        
        // Verifica se ci sono state modifiche
        if (JSON.stringify(updatedPackageJson) === originalPackageJson) {
            console.log(`⏩ Il file package.json è già aggiornato, nessuna modifica necessaria`);
            return;
        }
        
        // Scrivi il file package.json aggiornato
        writeFileSync(
            packageJsonFile,
            JSON.stringify(updatedPackageJson, null, 2),
            "utf8"
        );
        
        console.log(`✅ File package.json aggiornato con successo`);
        console.log(`💬 Aggiunti script: version, push-tags`);
        console.log(`💬 Configurati: commitlint, auto-changelog, lint-staged`);
    } catch (error) {
        console.error(`❌ Errore durante l'aggiornamento del file package.json: ${error.message}`);
    }
}

export default updatePackageJson;
