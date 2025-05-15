import { build } from 'esbuild';
import { chmod } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Genera il file dei dati dei sample files
 */
async function generateSampleFilesData() {
  console.log('\n📝 Generazione del file dei dati dei sample files...');
  
  try {
    const { stdout, stderr } = await execAsync('node ./src/generate-sample-data.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`❌ Errore durante la generazione del file dei dati: ${error.message}`);
    throw error;
  }
}

/**
 * Crea il bundle con esbuild
 */
async function createBundle() {
  console.log('\n🚀 Creazione del bundle in corso...');
  
  try {
    const result = await build({
      entryPoints: ['./src/index.js'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      format: 'esm',
      outfile: './index.js',
      banner: {
        js: '#!/usr/bin/env node',
      },
      minify: true,
      sourcemap: false,
    });
    
    // Rendi il file eseguibile
    await chmod('./index.js', 0o755);
    
    console.log('✅ Bundle creato con successo!');
  } catch (error) {
    console.error('❌ Errore durante la creazione del bundle:', error);
    throw error;
  }
}

/**
 * Esegue il processo di build completo
 */
async function runBuild() {
  try {
    console.log('🔧 Avvio del processo di build...');
    
    // Genera il file dei dati dei sample files
    await generateSampleFilesData();
    
    // Crea il bundle
    await createBundle();
    
    console.log('\n✨ Build completato con successo!');
  } catch (error) {
    console.error('\n❌ Build fallito:', error);
    process.exit(1);
  }
}

runBuild();
