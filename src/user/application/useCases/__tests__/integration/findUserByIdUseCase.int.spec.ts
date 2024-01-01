import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { PrismaClient } from "@prisma/client";
import { FindUserByIdUseCase } from "../../findUserByIdUseCase/FindUserByIdUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { Test, TestingModule } from "@nestjs/testing";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("FindUserByID UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: FindUserByIdUseCase.UseCase,
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
        SUT = new FindUserByIdUseCase.UseCase(repository);
        await prismaService.user.deleteMany();
    });

    it("Should throw an error when the user is not found", async () => {
        const id = "FakeID";
        await expect(() => SUT.execute({ id })).rejects.toThrow(new NotFoundError(`UserModel not found using ID ${id}`));
    });

    it("Should find an user by ID", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        await prismaService.user.create({ data: entity.toJSON() });

        const { _id: id } = entity;
        const output = await SUT.execute({ id });

        expect(output).toBeDefined();
        expect(output).toStrictEqual(entity.toJSON());
    });

    afterAll(async () => {
        await module.close();
    });
}); 