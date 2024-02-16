import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SignUpDTO } from "../../dtos/signUp.dto";
import { PrismaClient } from "@prisma/client";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { EnvConfigModule } from "@/shared/infra/env-config/env-config.module";
import { UserModule } from "../../user.module";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import request from "supertest";
import { UserController } from "../../user.controller";
import { instanceToPlain } from "class-transformer";
import { applyGlobalInterceptors } from "@/global.config";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Create end-to-end test", () => {
    let application: INestApplication,
        module: TestingModule,
        repository: UserRepository.Repository,
        signUpDTO: SignUpDTO;

    const prismaService: PrismaClient = new PrismaClient();

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [EnvConfigModule, UserModule, DatabaseModule.forTest(prismaService)]
        }).compile();

        application = module.createNestApplication();
        applyGlobalInterceptors(application);
        await application.init();
        repository = module.get<UserRepository.Repository>("UserRepository");
    }, 12000);

    beforeEach(async () => {
        await prismaService.user.deleteMany();
        signUpDTO = {
            name: "testname",
            email: "test@mail.com",
            password: "test123"
        };
    });

    describe("POST /user", () => {
        const endpoint = "/user";
        it("Should create an user", async () => {
            const response = await request(application.getHttpServer()).post(endpoint).send(signUpDTO).expect(201);
            expect(Object.keys(response["body"])).toStrictEqual(["data"]);

            const user = await repository.findById(response["body"]["data"]["id"]);
            const userPresenter = UserController.userToResponse(user.toJSON());
            const serialized = instanceToPlain(userPresenter);
            expect(response["body"]["data"]).toStrictEqual(serialized);
        });

        it("Should return an error with 422 status code when request body is invalid", async () => {
            const response = await request(application.getHttpServer()).post(endpoint).send({}).expect(422);
            const { statusCode, message, error } = response["body"];
            expect(statusCode).toEqual(422);
            expect(message["length"]).toBeGreaterThan(0);
            expect(error).toBe("Unprocessable Entity");
        });

        it("Should return an error with 422 status code when name property is invalid", async () => {
            delete signUpDTO["name"];
            const response = await request(application.getHttpServer()).post(endpoint).send(signUpDTO).expect(422);

            const { statusCode, message, error } = response["body"];
            expect(statusCode).toEqual(422);
            expect(message).toStrictEqual([
                "name should not be empty",
                "name must be a string"
            ]);
            expect(error).toBe("Unprocessable Entity");
        });

        it("Should return an error with 422 status code when email property is invalid", async () => {
            delete signUpDTO["email"];
            const response = await request(application.getHttpServer()).post(endpoint).send(signUpDTO).expect(422);

            const { statusCode, message, error } = response["body"];
            expect(statusCode).toEqual(422);
            expect(message).toStrictEqual([
                "email must be an email",
                "email should not be empty",
                "email must be a string"
            ]);
            expect(error).toBe("Unprocessable Entity");
        });

        it("Should return an error with 422 status code when password property is invalid", async () => {
            delete signUpDTO["password"];
            const response = await request(application.getHttpServer()).post(endpoint).send(signUpDTO).expect(422);

            const { statusCode, message, error } = response["body"];
            expect(statusCode).toEqual(422);
            expect(message).toStrictEqual([
                "password should not be empty",
                "password must be a string"
            ]);
            expect(error).toBe("Unprocessable Entity");
        });

        it("Should return an error with 422 status code with invalid property provided", async () => {
            const response = await request(application.getHttpServer()).post(endpoint).send(
                Object.assign(signUpDTO, { age: 22 })
            ).expect(422);

            const { statusCode, message, error } = response["body"];
            expect(statusCode).toEqual(422);
            expect(message).toStrictEqual([
                "property age should not exist"
            ]);
            expect(error).toBe("Unprocessable Entity");
        });

        it("Should return an error with 409 status code when email already exists", async () => {
            const entity = new UserEntity(UserDataBuilder({ ...signUpDTO }));
            await repository.insert(entity);
            const response = await request(application.getHttpServer())
                .post(endpoint)
                .send(signUpDTO)
                .expect(409)
                .expect({
                    statusCode: 409,
                    error: "Conflict",
                    message: "Email address already exists!"
                });
            console.log(response.body);
        });
    });
});