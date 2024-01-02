import { PrismaClient } from "@prisma/client";
import { UpdatePasswordUseCase } from "../../updatePasswordUseCase/UpdatePasswordUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { Test, TestingModule } from "@nestjs/testing";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { InvalidPasswordError } from "@/shared/application/errors/InvalidPasswordError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Update password UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: UpdatePasswordUseCase.UseCase,
        repository: UserRepository.Repository,
        hashProvider: IHashProvider,
        module: TestingModule;

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();

        repository = new UserPrismaRepository(prismaService as any);
        hashProvider = new BcryptJsHashProvider();
    });

    beforeEach(async () => {
        SUT = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
        await prismaService.user.deleteMany();
    });

    it("Should throw an error when user is not found", async () => {
        const data: UpdatePasswordUseCase.Input = {
            id: "FakeID",
            currentPassword: "123",
            newPassword: "1234"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new NotFoundError(`UserModel not found using ID ${data.id}`));
    });

    it("Should throw an error when current or old password is not provided", async () => {
        const entity = new UserEntity(UserDataBuilder({}));

        await prismaService.user.create({
            data: entity.toJSON()
        });

        const data: UpdatePasswordUseCase.Input = {
            id: entity._id,
            currentPassword: "",
            newPassword: "123"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new InvalidPasswordError("Current and old passwords required!"));

        data["currentPassword"] = "123";
        data["newPassword"] = "";

        await expect(() => SUT.execute(data)).rejects.toThrow(new InvalidPasswordError("Current and old passwords required!"));
    });

    it("Should throw an error when current password doesn't match", async () => {
        const entity = new UserEntity(UserDataBuilder({}));

        await prismaService.user.create({
            data: entity.toJSON()
        });

        const data: UpdatePasswordUseCase.Input = {
            id: entity._id,
            currentPassword: "testPassword",
            newPassword: "123"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new InvalidPasswordError("Current password doesn't match!"));
    });

    it("Should update the user password", async () => {
        const currentPassword = "test",
            hashedPassword = await hashProvider.generateHash(currentPassword),
            entity = new UserEntity(UserDataBuilder({ password: hashedPassword }));

        await prismaService.user.create({
            data: entity.toJSON()
        });
        
        const newPassword = "123",
            data: UpdatePasswordUseCase.Input = {
                id: entity._id,
                currentPassword,
                newPassword
            };

        const output = await SUT.execute(data),
            compareHashPasswords = await hashProvider.compareHash(newPassword, output.password); 
        
        expect(compareHashPasswords).toBeTruthy();
    });

    afterAll(async () => {
        await module.close();
    });
});