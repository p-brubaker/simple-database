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
        const pathToWrite = path.join(this.path, obj.id + '.json');
        return fs.writeFile(pathToWrite, JSON.stringify(obj)).then(() => {
            return obj.id + '.json';
        });
    }

    get(id) {
        const fileToRead = path.join(this.path, id);
        return fs
            .readFile(fileToRead)
            .then((result) => {
                return JSON.parse(result);
            })
            .catch(() => {
                return null;
            });
    }

    getAll() {
        return fs.readdir(this.path).then((files) => {
            return Promise.all(
                files.map((file) => {
                    return this.get(file);
                })
            );
        });
    }

    remove(id) {
        const fileToRemove = path.join(this.path, id);
        return fs.rm(fileToRemove);
    }

    update(id, obj) {
        const pathToWrite = path.join(this.path, id);
        return fs.writeFile(pathToWrite, JSON.stringify(obj)).then(() => {
            return id;
        });
    }
}
