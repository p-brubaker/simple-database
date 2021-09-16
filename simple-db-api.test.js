import { rm, mkdir } from 'fs/promises';
import { SimpleDb } from './simple-db-api.js';

describe('simple database', () => {
    const rootDir = './__test__rootdir';

    beforeEach(() => {
        return rm(rootDir, { force: true, recursive: true })
            .then(mkdir(rootDir))
            .catch((err) => console.error(err));
    });

    it.only('should return an id when an object is saved', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeId = simpleDb.save({ data: 'fake data' });
        expect(fakeId).toEqual(expect.any(String));
    });

    it('should save and then get an object', () => {
        const simpleDb = new SimpleDb(rootDir);
        const fakeData = { data: 'fake data' };
        const dataGotten = simpleDb
            .save(fakeData)
            .then((id) => {
                simpleDb.get(id);
            })
            .catch((err) => console.error(err));
        expect(dataGotten).toStrictEqual({
            id: expect.any(String),
            data: 'fake data',
        });
    });

    it('should return null for a non-existant id', () => {
        const simpleDb = new SimpleDb(rootDir);
        const noIdResult = simpleDb
            .get('thisIdDoesNotExist')
            .catch((err) => console.error(err));
        expect(noIdResult).toEqual(null);
    });

    it('should return all the objects in the root directory', () => {
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

    it('should remove an object', () => {
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

    it('should update an object', () => {
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
