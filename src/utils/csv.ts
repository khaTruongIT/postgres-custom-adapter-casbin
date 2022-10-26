import fs from 'fs-extra';
const papa = require('papaparse');

export function fileToJson(pathName: string) {
  const csvFile = fs.readFileSync(pathName, {encoding: 'utf-8'});
  return papa.parse(csvFile, {header: true, skipEmptyLines: true});
}
