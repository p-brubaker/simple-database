import fs from 'fs/promises';
import path from 'path';

export class SimpleDb {
  constructor(rootDir) {
    this.path = rootDir;
  }

  generateId() {
    return Math.round(Math.random() * 100000000000).toString(16);
  }

  save(obj) {
    obj.id = this.generateId();
    fs.writeFile(path.join(this.path, obj.id), JSON.stringify(obj));
    return obj.id;
  }
}
