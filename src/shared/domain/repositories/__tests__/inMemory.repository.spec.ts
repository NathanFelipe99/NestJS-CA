import { NotFoundError } from "./../../errors/NotFoundError";
import { Entity } from "../../entities/Entity";
import { InMemoryRepository } from "../inMemory.repository";

type StubEntityProps = {
    name: string;
    price: number;
};

class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemoryRepository extends InMemoryRepository<StubEntity> { }

describe("In memory repository unit tests", () => {
    let SUT: StubInMemoryRepository;

    beforeEach(() => {
        SUT = new StubInMemoryRepository();
    });

    it("Should insert a new entity", async () => {
        const props = {
            name: "Smartphone",
            price: 2500
        };

        const entity = new StubEntity(props);
        await SUT.insert(entity);
        expect(SUT.items).toHaveLength(1);
        expect(entity.toJSON()).toStrictEqual(SUT.items[0].toJSON());
    });

    describe("Testing findByID method", () => {
        it("Should find an entity by ID", async () => {
            const props = {
                name: "Smartphone",
                price: 2500
            };

            const entity = new StubEntity(props);
            await SUT.insert(entity);
            const foundEntity = await SUT.findById(entity._id);
            expect(foundEntity).toStrictEqual(entity);
            expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
            expect(foundEntity.props).toStrictEqual(props);
        });

        it("Should throw error when entity not found", () => {
            expect(async () => await SUT.findById("")).rejects.toThrow(new NotFoundError("Entity not found!"));
        });
    });

    describe("Testing findAll method", () => {
        it("Should return an empty array when no entity be inserted", async () => {
            expect(await SUT.findAll()).toHaveLength(0);
        });

        it("Should find all entities", async () => {
            const entityArray: StubEntityProps[] = [
                {
                    name: "Glasses",
                    price: 250
                },
                {
                    name: "Guitar",
                    price: 500
                }
            ];

            for (let index = 0; index < entityArray.length; index++) {
                const entityProps = entityArray[index];
                const entity = new StubEntity(entityProps);
                await SUT.insert(entity);
            }

            const findAllResult = await SUT.findAll();
            expect(findAllResult).toHaveLength(2);
            expect(findAllResult[0].props).toStrictEqual(entityArray[0]);
            expect(findAllResult[1].props).toStrictEqual(entityArray[1]);
        });
    });

    describe("Testing update method", () => {
        it("Should throw error when entity not found", () => {
            const props: StubEntityProps = {
                name: "New name",
                price: 100
            };
            const entity = new StubEntity(props);

            expect(async () => await SUT.update(entity)).rejects.toThrow(new NotFoundError("Entity index not found!"));
        });

        it("Should update an entity", async () => {
            const props: StubEntityProps = {
                name: "Violin",
                price: 500
            };
            const entity = new StubEntity(props);
            await SUT.insert(entity);

            const updateProps: StubEntityProps = {
                name: "Eletric violin",
                price: 2600
            };

            const entityUpdated = new StubEntity(updateProps, entity._id);

            await SUT.update(entityUpdated);
            expect(entityUpdated.toJSON()).toStrictEqual(SUT.items[0].toJSON());
        });
    });

    describe("Testing delete method", () => {
        it("Should throw error when entity not found", () => {
            const props: StubEntityProps = {
                name: "New name",
                price: 100
            };
            const entity = new StubEntity(props);

            expect(() => SUT.delete(entity._id)).rejects.toThrow(new NotFoundError("Entity index not found!"));
        });

        it("Should delete an entity", async () => {
            const props: StubEntityProps = {
                name: "New name",
                price: 100
            };

            const entity = new StubEntity(props);
            await SUT.insert(entity);

            await SUT.delete(entity._id);
            expect(SUT.items).toHaveLength(0);
        });
        
    });
});