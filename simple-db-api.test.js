import { rmdirSync, mkdirSync } from 'fs';
import { SimpleDb } from './simple-db-api.js';

describe('simple database', () => {
    const rootDir = '__test__rootdir';

    beforeEach(() => {
        rmdirSync(rootDir, { recursive: true, force: true });
        mkdirSync(rootDir);
    });

    it('should return an id when an object is saved', () => {
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

    it.skip('should return all the objects in the root directory', () => {
        const simpleDb = new SimpleDb(rootDir);
        const allObjects = [
            { data: 'fake1' },
            { data: 'fake2' },
            { data: 'fake3' },
        ];
        allObjects.forEach((obj) => simpleDb.save(obj));
        const getAllResult = simpleDb
            .getAll()
            .catch((err) => console.error(err));
        expect(getAllResult).toStrictEqual([
            { id: expect.any(String), data: 'fake1' },
            { id: expect.any(String), data: 'fake2' },
            { id: expect.any(String), data: 'fake3' },
        ]);
    });

    it.skip('should remove an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeObject = { data: 'fake' };
        const shouldBeNull = simpleDb.save(fakeObject).then((id) => {
            simpleDb.get(id).then((obj) => {
                simpleDb
                    .delete(obj.id)
                    .then(simpleDb.get(obj.id))
                    .catch((err) => console.error(err));
            });
        });
        expect(shouldBeNull).toEqual(null);
        //save an object, get back its id
        //use the id to get to make sure the object is really there
        //delete the object
        //use get with the id again to check the object really got deleted
    });

    it.skip('should update an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeObject = { data: 'fake' };
        const objToUpDateWith = { data: 'updated fake' };
        const updated = simpleDb.save(fakeObject).then((id) => {
            simpleDb
                .update(id, objToUpDateWith)
                .then((id) => simpleDb.get(id))
                .catch((err) => console.error(err));
        });
        expect(updated).toStrictEqual({
            id: expect.any(String),
            data: 'updated fake',
        });
    });
});
