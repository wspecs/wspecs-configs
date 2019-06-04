const yaml = require('yamljs');
import { readFileSync, writeFileSync } from 'fs';
const fetch = require('node-fetch');
const shell = require('shelljs');

const WSPECS_FILE = __dirname + '/../../wspecs.yml';
const CONFIG_FOLDER = __dirname + '/../../configs';
const ENCODING = 'utf8';

export function cleanConfigs() {
  shell.rm('-rf', `${CONFIG_FOLDER}/**`);
  shell.mkdir('-p', CONFIG_FOLDER);
}

export async function readWspecsConfig() {
  const content = readFileSync(WSPECS_FILE, ENCODING);
  const config = yaml.parse(content);
  for (const file of config.wspecs) {
    const url = `${file}?t=${Date.now()}`;
    const specs = await fetchWspecsConfig(url);
    for (const bucket of specs.buckets || []) {
      const folder = `${CONFIG_FOLDER}/${bucket}`;
      console.log(specs);
      if (specs.name) {
        shell.mkdir('-p', folder);
        writeFileSync(
          `${folder}/${specs.name}.json`,
          JSON.stringify(specs, null, 2),
          ENCODING
        );
      }
    }
  }
}

export async function fetchWspecsConfig(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  return yaml.parse(text);
}
