import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "../../user.prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";

describe("User Prisma Repository integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: UserPrismaRepository,
        module: TestingModule;

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile();
    });

    beforeEach(async () => {
        SUT = new UserPrismaRepository(prismaService as any);
        await prismaService.user.deleteMany();
    });

    it("Should throw error when entity is not found", async () => {
        const id = "FakeID";
        expect(() => SUT.findById(id)).rejects.toThrow(new NotFoundError(`UserModel not found using ID ${id}`));
    });

    it("Should find an entity by ID", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        const newUser = await prismaService.user.create({ data: entity.toJSON() });

        const output = await SUT.findById(newUser.id);
        expect(output.toJSON()).toStrictEqual(entity.toJSON());
    });

    it("Should create an user entity", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        await SUT.insert(entity);

        const result = await prismaService.user.findUnique({
            where: {
                id: entity._id
            }
        });

        expect(result).toStrictEqual(entity.toJSON());
    });

    it("should find all user entities", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        await prismaService.user.create({ data: entity.toJSON() });

        const entities = await SUT.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    describe("Search method tests", () => {
        it("Should only apply pagination when parameters are null", async () => {
            const createdAt = new Date(),
                entities: UserEntity[] = [],
                arrange = Array(16).fill(UserDataBuilder({}));

            arrange.forEach((element, index) => {
                entities.push(new UserEntity({
                    ...element,
                    email: `test${index}@mail.com`,
                    createdAt: new Date(createdAt.getTime() + index)
                }));
            });

            await prismaService.user.createMany({
                data: entities.map(item => item.toJSON())
            });

            const searchOutput = await SUT.search(new UserRepository.SearchParams());
            expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
            expect(searchOutput.total).toBe(16);
            searchOutput.items.forEach((item) => {
                expect(item).toBeInstanceOf(UserEntity);
            });
        });
    });
});