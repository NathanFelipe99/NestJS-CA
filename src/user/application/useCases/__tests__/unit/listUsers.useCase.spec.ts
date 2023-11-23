import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { ListUsersUseCase } from "../../listUsersUseCase/ListUsersUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Testing ListUsers use case", () => {
    let SUT: ListUsersUseCase.UseCase,
        repository: UserInMemoryRepository;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        SUT = new ListUsersUseCase.UseCase(repository);
    });

    describe("toOuput method", () => {
        it("It should return an empty array of items", () => {
            const result = new UserRepository.SearchResult({
                items: [] as any,
                total: 1,
                currentPage: 1,
                perPage: 2,
                sortField: null,
                sortDir: null,
                filter: null
            });

            const output = SUT["toOutput"](result);
            expect(output).toStrictEqual({
                items: [],
                total: 1,
                currentPage: 1,
                lastPage: 1,
                perPage: 2
            });
        });

        it("toOutput method", () => {
            const entity = new UserEntity(UserDataBuilder({}));
            const result = new UserRepository.SearchResult({
                items: [entity],
                total: 1,
                currentPage: 1,
                perPage: 2,
                sortField: null,
                sortDir: null,
                filter: null
            });

            const output = SUT["toOutput"](result);
            expect(output).toStrictEqual({
                items: [entity.toJSON()],
                total: 1,
                currentPage: 1,
                lastPage: 1,
                perPage: 2
            });
        });

        it("Execute method It should return users ordered by createdAt", async () => {
            const createdAt = new Date(),
                items = [
                    new UserEntity(UserDataBuilder({ createdAt })),
                    new UserEntity(UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }))
                ];

            repository.items = items;

            const output = await SUT.execute({});

            expect(output).toStrictEqual({
                items: [...items].reverse().map((pItem) => pItem.toJSON()),
                total: 2,
                currentPage: 1,
                lastPage: 1,
                perPage: 15
            });
        });

        it("Execute method It should return users using pagination, sort and filter", async () => {
            const items = [
                    new UserEntity(UserDataBuilder({ name: "John Doe" })),
                    new UserEntity(UserDataBuilder({ name: "Jane Doe" })),
                    new UserEntity(UserDataBuilder({ name: "Jason Krueger" })),
                    new UserEntity(UserDataBuilder({ name: "Freddy Voorhees" })),
                    new UserEntity(UserDataBuilder({ name: "Homer Simpson" })),
                ];

            repository.items = items;

            let output = await SUT.execute({
                page: 1,
                perPage: 2,
                sortField: "name",
                sortDir: "ASC",
                filter: "J"
            });

            expect(output).toStrictEqual({
                items: [items[1].toJSON(), items[2].toJSON()],
                total: items["length"],
                currentPage: 1,
                lastPage: 3,
                perPage: 2
            });

            output = await SUT.execute({
                page: 2,
                perPage: 2,
                sortField: "name",
                sortDir: "ASC",
                filter: "J"
            });

            expect(output).toStrictEqual({
                items: [items[0].toJSON()],
                total: items["length"],
                currentPage: 2,
                lastPage: 3,
                perPage: 2
            });

            output = await SUT.execute({
                page: 1,
                perPage: 2,
                sortField: "name",
                sortDir: "DESC",
                filter: "J"
            });

            expect(output).toStrictEqual({
                items: [items[0].toJSON(), items[2].toJSON()],
                total: items["length"],
                currentPage: 1,
                lastPage: 3,
                perPage: 2
            });

            output = await SUT.execute({
                page: 1,
                perPage: 3,
                sortField: "name",
                sortDir: "DESC",
                filter: "J"
            });

            expect(output).toStrictEqual({
                items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
                total: items["length"],
                currentPage: 1,
                lastPage: 2,
                perPage: 3
            });
        });
    });

});