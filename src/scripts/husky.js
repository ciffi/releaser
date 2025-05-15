#! /usr/bin/env node
import { existsSync, writeFileSync, readFileSync, appendFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { exec } from "child_process";

const rootPath = resolve(process.env.INIT_CWD || process.cwd());
const huskyHiddenPath = resolve(rootPath, ".husky");
const gitIgnorePath = resolve(rootPath, ".gitignore");
const huskyIgnoreString = ".husky";
const commitlintString = `npx commitlint --edit $1`;
const lintStagedString = `lint-staged\nrm -rf *.tsbuildinfo`;
const huskyCommitMsgPath = resolve(huskyHiddenPath, "commit-msg");
const huskyPreCommitPath = resolve(huskyHiddenPath, "pre-commit");

function addHuskyToGitIgnore() {
  try {
    if (!existsSync(gitIgnorePath)) {
      console.log(`\n📝 Creazione del file .gitignore...`);
      writeFileSync(gitIgnorePath, huskyIgnoreString);
      console.log(`✅ File .gitignore creato con successo`);
    } else {
      const gitignore = readFileSync(gitIgnorePath, "utf8");
      if (!gitignore.includes(huskyIgnoreString)) {
        console.log(`📝 Aggiunta di .husky al file .gitignore...`);
        appendFileSync(gitIgnorePath, `\n${huskyIgnoreString}`);
        console.log(`✅ .husky aggiunto al file .gitignore`);
      } else {
        console.log(`⏩ .husky già presente nel file .gitignore`);
      }
    }
  } catch (error) {
    console.error(`❌ Errore durante la modifica del file .gitignore: ${error.message}`);
  }
}

function updateHusky() {
  try {
    console.log(`📝 Configurazione degli hook di Husky...`);
    let updatedFiles = 0;
    
    // Assicurati che la directory .husky esista
    if (!existsSync(huskyHiddenPath)) {
      mkdirSync(huskyHiddenPath, { recursive: true });
      console.log(`✅ Directory .husky creata`);
    }
    
    // Gestione del file commit-msg
    const existsCommitMsg = existsSync(huskyCommitMsgPath);
    if (!existsCommitMsg) {
      writeFileSync(huskyCommitMsgPath, commitlintString);
      console.log(`✅ Hook commit-msg creato`);
      updatedFiles++;
    } else {
      const commitMessageContent = readFileSync(huskyCommitMsgPath, "utf8");
      if (commitMessageContent !== commitlintString) {
        writeFileSync(huskyCommitMsgPath, commitlintString);
        console.log(`✅ Hook commit-msg aggiornato`);
        updatedFiles++;
      } else {
        console.log(`⏩ Hook commit-msg già configurato correttamente`);
      }
    }
    
    // Gestione del file pre-commit
    const existsPreCommit = existsSync(huskyPreCommitPath);
    if (!existsPreCommit) {
      writeFileSync(huskyPreCommitPath, lintStagedString);
      console.log(`✅ Hook pre-commit creato`);
      updatedFiles++;
    } else {
      const preCommitContent = readFileSync(huskyPreCommitPath, "utf8");
      if (preCommitContent !== lintStagedString) {
        writeFileSync(huskyPreCommitPath, lintStagedString);
        console.log(`✅ Hook pre-commit aggiornato`);
        updatedFiles++;
      } else {
        console.log(`⏩ Hook pre-commit già configurato correttamente`);
      }
    }
    
    // Rendi eseguibili gli hook
    exec(`chmod +x ${huskyCommitMsgPath} ${huskyPreCommitPath}`, { cwd: rootPath }, (error) => {
      if (error) {
        console.error(`❌ Errore durante l'impostazione dei permessi degli hook: ${error.message}`);
      } else {
        console.log(`✅ Permessi degli hook impostati correttamente`);
      }
    });
    
    console.log(`📊 Riepilogo: ${updatedFiles} hook aggiornati`);
  } catch (error) {
    console.error(`❌ Errore durante l'aggiornamento degli hook di Husky: ${error.message}`);
  }
}

function addHuskyToProject() {
  try {
    console.log('\n🔧 Inizializzazione di Husky...');
    if (!existsSync(huskyHiddenPath)) {
      console.log(`📝 Esecuzione di husky init...`);
      exec(`npx husky init`, { cwd: rootPath }, (error) => {
        if (error) {
          console.error(`❌ Errore durante l'inizializzazione di Husky: ${error.message}`);
        } else {
          console.log(`✅ Husky inizializzato con successo`);
          updateHusky();
        }
      });
    } else {
      console.log(`⏩ Directory .husky già esistente, procedo con l'aggiornamento`);
      updateHusky();
    }
  } catch (error) {
    console.error(`❌ Errore durante l'aggiunta di Husky al progetto: ${error.message}`);
  }
}

function initHusky() {
  console.log('\n🚀 Configurazione di Husky per il controllo della qualità del codice...');
  addHuskyToProject();
  addHuskyToGitIgnore();
}

export default initHusky;
