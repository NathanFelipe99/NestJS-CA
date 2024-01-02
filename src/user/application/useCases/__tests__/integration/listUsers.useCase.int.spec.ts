import { PrismaClient } from "@prisma/client";
import { ListUsersUseCase } from "../../listUsersUseCase/ListUsersUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { Test, TestingModule } from "@nestjs/testing";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { SortDirection } from "@/shared/domain/repositories/searchable-repository.contracts";

describe("ListUsers UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: ListUsersUseCase.UseCase,
        repository: UserRepository.Repository,
        module: TestingModule;

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();

        repository = new UserPrismaRepository(prismaService as any);
    });

    beforeEach(async () => {
        SUT = new ListUsersUseCase.UseCase(repository);
        await prismaService.user.deleteMany();
    });

    it("Should return users ordered by 'createdAt'", async () => {
        const createdAt = new Date(),
            entities: UserEntity[] = [],
            arrange = Array(3).fill(UserDataBuilder({}));

        arrange.forEach((item, index) => {
            entities.push(
                new UserEntity({
                    ...item,
                    email: `test${index}@mail.com`,
                    createdAt: new Date(createdAt.getTime() + index)
                })
            );
        });

        await prismaService.user.createMany({
            data: entities.map((entity) => entity.toJSON())
        });

        const output = await SUT.execute({}),
            searchResultProps: ListUsersUseCase.Output = {
                items: entities.reverse().map((entity) => entity.toJSON()),
                total: entities["length"],
                currentPage: 1,
                perPage: 15,
                lastPage: 1
            };
        
        expect(output).toStrictEqual(searchResultProps);
    });

    it("Should return the users using filter, sort and pagination", async () => {
        const createdAt = new Date(),
            entities: UserEntity[] = [],
            arrange = ["test", "teSt22", "TEST", "b", "a"];

        arrange.forEach((item, index) => {
            entities.push(
                new UserEntity({
                    ...UserDataBuilder({ name: item }),
                    email: `test${index}@mail.com`,
                    createdAt: new Date(createdAt.getTime() + index)
                })
            );
        });

        await prismaService.user.createMany({
            data: entities.map((entity) => entity.toJSON())
        });

        const searchParams = {
            page: 1,
            perPage: 2,
            sortField: "name",
            sortDir: "ASC" as SortDirection,
            filter: "test"
        };

        let output = await SUT.execute(searchParams);

        expect(output).toMatchObject({
            items: [entities[0].toJSON(), entities[2].toJSON()],
            total: 3,
            currentPage: 1,
            perPage: 2,
            lastPage: 2
        });

        searchParams["page"] = 2;
        output = await SUT.execute(searchParams);

        expect(output).toMatchObject({
            items: [entities[1].toJSON()],
            total: 3,
            currentPage: 2,
            perPage: 2,
            lastPage: 2
        });
    });

    afterAll(async () => {
        await module.close();
    });
});