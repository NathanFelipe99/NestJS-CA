import { PrismaClient } from "@prisma/client";
import { DeleteUserUseCase } from "../../deleteUserUseCase/DeleteUserUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { Test, TestingModule } from "@nestjs/testing";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("DeleteUser UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: DeleteUserUseCase.UseCase,
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
        SUT = new DeleteUserUseCase.UseCase(repository);
        await prismaService.user.deleteMany();
    });

    it("Should throw an error when entity is not found", async () => {
        const id = "FakeID";
        await expect(() => SUT.execute({ id })).rejects.toThrow(new NotFoundError(`UserModel not found using ID ${id}`));
    });

    it("Should delete an user", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        await prismaService.user.create({ data: entity.toJSON() });

        const { _id } = entity;
        await SUT.execute({ id: _id });

        const output = await prismaService.user.findUnique({
            where: {
                id: _id
            }
        });

        expect(output).toBeNull();
    });
});