import { PrismaClient, User } from "@prisma/client";
import { UserModelMapper } from "../../user.model.mapper";
import { UserEntity } from "@/user/domain/entities/user.entity";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";

describe("User Model Mapper integration tests", () => {
    let databaseService: PrismaClient,
        props: any;
    
    beforeAll(async () => {
        setupPrismaTests();
        databaseService = new PrismaClient();
        await databaseService.$connect();
    }, 10000);

    beforeEach(async () => {
        await databaseService.user.deleteMany();
        props = {
            id: "d4255494-f981-4d26-a2a1-35d3f5b8d36a",
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "eodnhoj",
            createdAt: new Date()
        };
    });

    it("Should throw an error when the UserModule is invalid", async () => {
        const model: User = Object.assign(props, { name: null });
        expect(() => UserModelMapper.toEntity(model)).toThrowError("The entity hasn't been loaded.");
    });

    it("Should convert an UserModel to an UserEntity", async () => {
        const model: User = await databaseService.user.create({
            data: props
        });

        const SUT = UserModelMapper.toEntity(model);
        expect(SUT).toBeInstanceOf(UserEntity);
        expect(SUT.toJSON()).toStrictEqual(props);
    });

    afterAll(async () => {
        await databaseService.$disconnect();
    });
});