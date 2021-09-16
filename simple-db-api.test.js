import { rmdirSync, mkdirSync } from 'fs';
import { SimpleDb } from './simple-db-api.js';

describe.skip('simple database', () => {
    const rootDir = '__test__rootdir';

    beforeEach(() => {
        rmdirSync(rootDir, { recursive: true, force: true });
        mkdirSync(rootDir);
    });

    it.only('should return an id when an object is saved', () => {
        const simpleDb = new SimpleDb(rootDir);
        return simpleDb.save({ data: 'fake data' }).then((id) => {
            expect(id).toEqual(expect.any(String));
        });
    });

    it('should save and then get an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeData = { data: 'fake data' };

        return simpleDb.save(fakeData).then((id) => {
            return simpleDb.get(id).then((result) => {
                expect(result).toStrictEqual({
                    id: expect.any(String),
                    data: 'fake data',
                });
            });
        });
    });

    it('should return null for a non-existant id', () => {
        const simpleDb = new SimpleDb(rootDir);
        return simpleDb.get('thisIdDoesNotExist').then((result) => {
            expect(result).toEqual(null);
        });
    });

    it('should return all the objects in the root directory', () => {
        const simpleDb = new SimpleDb(rootDir);
        const allObjects = new Set([
            { data: 'fake1' },
            { data: 'fake2' },
            { data: 'fake3' },
        ]);
        allObjects.forEach((obj) => simpleDb.save(obj));
        return simpleDb.getAll().then((results) => {
            expect(new Set(results)).toStrictEqual(
                new Set([
                    { id: expect.any(String), data: 'fake1' },
                    { id: expect.any(String), data: 'fake2' },
                    { id: expect.any(String), data: 'fake3' },
                ])
            );
        });
    });

    it('should remove an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeObjects = [{ data: 'fake1' }, { data: 'fake2' }];
        simpleDb.save(fakeObjects[0]).then(() => {
            return simpleDb
                .save(fakeObjects[1])
                .then((id) => {
                    return simpleDb.remove(id);
                })
                .then(() => {
                    return simpleDb.getAll();
                })
                .then((result) => {
                    expect(result).toStrictEqual([
                        {
                            id: expect.any(String),
                            data: 'fake1',
                        },
                    ]);
                });
        });
    });

    it('should update an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeObject = { data: 'fake' };
        const objToUpDateWith = { data: 'updated fake' };
        simpleDb.save(fakeObject).then((id) => {
            return simpleDb
                .update(id, { ...objToUpDateWith, id })
                .then((id) => {
                    return simpleDb.get(id).then((updated) => {
                        expect(updated).toStrictEqual({
                            id: expect.any(String),
                            data: 'updated fake',
                        });
                    });
                });
        });
    });
});
