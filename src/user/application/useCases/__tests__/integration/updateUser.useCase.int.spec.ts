import { PrismaClient } from "@prisma/client";
import { UpdateUserUseCase } from "../../updateUserUseCase/UpdateUserUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("UpdateUser UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: UpdateUserUseCase.UseCase,
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
        SUT = new UpdateUserUseCase.UseCase(repository);
        await prismaService.user.deleteMany();
    });

    it("Should throw an error when name property is not provided", async () => {
        const data: UpdateUserUseCase.Input = {
            id: "FakeID",
            name: ""
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new BadRequestError("Name wasn't provided!"));
    });

    it("Should throw an error when entity is not found", async () => {
        const data: UpdateUserUseCase.Input = {
            id: "FakeID",
            name: "TEST"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new NotFoundError(`UserModel not found using ID ${data.id}`));
    });


    it("Should update the user name", async () => {
        const entity = new UserEntity(UserDataBuilder({}));
        await prismaService.user.create({
            data: entity.toJSON()
        });

        const data: UpdateUserUseCase.Input = {
            id: entity._id,
            name: "John Doe"
        };

        const output = await SUT.execute(data);

        expect(output.name).toStrictEqual(data.name);
    });

    afterAll(async () => {
        await module.close();
    });
});