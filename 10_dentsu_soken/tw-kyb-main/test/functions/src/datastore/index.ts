import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const datastorePath = os.tmpdir();

export const load = (fileName: string): unknown[] | undefined => {
  const localPath: string = path.join(datastorePath, fileName);
  if (fs.existsSync(localPath)) {
    const bufferData = fs.readFileSync(localPath);
    const dataJSON = bufferData.toString();
    return JSON.parse(dataJSON);
  }
  return;
};

export const saveChage = (fileName: string, data: unknown) => {
  const localPath: string = path.join(datastorePath, fileName);
  fs.writeFileSync(localPath, JSON.stringify(data));
};
