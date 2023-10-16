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

        it("Shouldn't throw error when entity not found", () => {
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

    });

    describe("Testing delete method", () => {

    });
});