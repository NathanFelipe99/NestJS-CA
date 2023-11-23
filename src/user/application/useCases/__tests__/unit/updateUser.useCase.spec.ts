import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { UpdateUserUseCase } from "../../updateUserUseCase/UpdateUserUseCase";

describe("Testing UpdateUser use case ", () => {
    let SUT: UpdateUserUseCase.UseCase,
        repository: UserInMemoryRepository;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        SUT = new UpdateUserUseCase.UseCase(repository);
    });

    it("It should throw an error when name is not provided", async () => {
        await expect(SUT.execute({ id: "TestID", name: "" })).rejects.toThrowError("Name wasn't provided!");
    });

    it("It should throw an error when entity is not found", async () => {
        await expect(() => SUT.execute({ id: "fakeID", name: "NewName" })).rejects.toThrowError("Entity not found!");
    });

    it("It should update an user", async () => {
        const updateSpyOn = jest.spyOn(repository, "update");
        const items: UserEntity[] = [
            new UserEntity(UserDataBuilder({})),
            new UserEntity(UserDataBuilder({}))
        ];

        repository.items = items;

        const entityResult = await SUT.execute({ id: items[0]._id, name: "Test Name" });
        expect(updateSpyOn).toHaveBeenCalledTimes(1);
        expect(entityResult).toMatchObject({ ...items[0].props, name: "Test Name" });
    });
});