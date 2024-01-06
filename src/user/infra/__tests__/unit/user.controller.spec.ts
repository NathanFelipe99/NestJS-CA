import { UserController } from '../../user.controller';
import { UserOutput } from '@/user/application/dto/userOutput';
import { SignInUseCase } from '@/user/application/useCases/signInUseCase/SignInUseCase';
import { SignUpUseCase } from '@/user/application/useCases/signUpUseCase/SignUpUseCase';
import { UpdatePasswordUseCase } from '@/user/application/useCases/updatePasswordUseCase/UpdatePasswordUseCase';
import { UpdateUserUseCase } from '@/user/application/useCases/updateUserUseCase/UpdateUserUseCase';
import { SignUpDTO } from '../../dtos/signUp.dto';
import { SignInDTO } from '../../dtos/signIn.dto';
import { UpdateUserDto } from '../../dtos/updateUser.dto';
import { UpdatePasswordDTO } from '../../dtos/updatePassword.dto';
import { DeleteUserUseCase } from '@/user/application/useCases/deleteUserUseCase/DeleteUserUseCase';
import { FindUserByIdUseCase } from '@/user/application/useCases/findUserByIdUseCase/FindUserByIdUseCase';
import { ListUsersUseCase } from '@/user/application/useCases/listUsersUseCase/ListUsersUseCase';
import { UserPresenter } from '../../presenters/user.presenter';

describe("UserController unit tests", () => {
    let SUT: UserController,
        id: string,
        props: UserOutput;

    beforeEach(async () => {
        SUT = new UserController();
        id = "e56c4efc-3831-430f-9034-d8390c62b371";
        props = {
            id,
            name: "Test",
            password: "1234",
            email: "test@mail.com",
            createdAt: new Date()
        };
    });

    it("SUT should be defined", () => {
        expect(SUT).toBeDefined();
    });

    it("It should create an user", async () => {
        const output: SignUpUseCase.Output = props,
            input: SignUpDTO = {
                name: "Test",
                password: "1234",
                email: "test@mail.com",
            };

        const mockSignUpUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["signUpUseCase"] = mockSignUpUseCase as any;
        const presenter = await SUT.create(input);

        expect(presenter).toBeInstanceOf(UserPresenter.Presenter);
        expect(presenter).toStrictEqual(new UserPresenter.Presenter(output));
        expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
    });

    it("It should login with credentials", async () => {
        const output: SignInUseCase.Output = props,
            input: SignInDTO = {
                password: "1234",
                email: "test@mail.com"
            };

        const mockSignInUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["signInUseCase"] = mockSignInUseCase as any;
        const presenter = await SUT.login(input);

        expect(presenter).toBeInstanceOf(UserPresenter.Presenter);
        expect(presenter).toStrictEqual(new UserPresenter.Presenter(output));
        expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input);
    });

    it("It should update an user", async () => {
        const output: UpdateUserUseCase.Output = props,
            input: UpdateUserDto = {
                name: "NewUser"
            };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["updateUserUseCase"] = mockUpdateUseCase as any;
        const presenter = await SUT.update(id, { name: input.name });

        expect(presenter).toBeInstanceOf(UserPresenter.Presenter);
        expect(presenter).toStrictEqual(new UserPresenter.Presenter(output));
        expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    });

    it("It should update the user password", async () => {
        const output: UpdatePasswordUseCase.Output = props,
            input: UpdatePasswordDTO = {
                currentPassword: props.password,
                newPassword: "test1234"
            };

        const mockUpdatePasswordUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["updatePasswordUseCase"] = mockUpdatePasswordUseCase as any;
        const presenter = await SUT.updatePassword(id, { currentPassword: input.currentPassword, newPassword: input.newPassword });
        
        expect(presenter).toBeInstanceOf(UserPresenter.Presenter);
        expect(presenter).toStrictEqual(new UserPresenter.Presenter(output));
        expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    });

    it("It should remove the user", async () => {
        const output = undefined;

        const mockDeleteUserUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["deleteUserUseCase"] = mockDeleteUserUseCase as any;
        const result = await SUT.remove(id);
        expect(output).toStrictEqual(result);
        expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
    });

    it("It should find one user", async () => {
        const output: FindUserByIdUseCase.Output = props;

        const mockFindOneUserUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["findUserByIdUseCase"] = mockFindOneUserUseCase as any;
        const presenter = await SUT.findOne(id);
        
        expect(presenter).toBeInstanceOf(UserPresenter.Presenter);
        expect(presenter).toStrictEqual(new UserPresenter.Presenter(output));
        expect(mockFindOneUserUseCase.execute).toHaveBeenCalledWith({ id });
    });

    it("It should find users by search params", async () => {
        const output: FindUserByIdUseCase.Output = props;

        const mockFindOneUserUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["findUserByIdUseCase"] = mockFindOneUserUseCase as any;
        const result = await SUT.findOne(id);
        expect(output).toStrictEqual(result);
        expect(mockFindOneUserUseCase.execute).toHaveBeenCalledWith({ id });
    });

    it("It should list users by search params", async () => {
        const output: ListUsersUseCase.Output = {
            items: [props],
            currentPage: 1,
            perPage: 1,
            lastPage: 1,
            total: 1
        },
            searchParams = {
                page: 1,
                perPage: 1
            }

        const mockListUsersUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output))
        };

        SUT["listUsersUseCase"] = mockListUsersUseCase as any;
        const presenter = await SUT.search(searchParams);
        
        expect(presenter).toBeInstanceOf(UserPresenter.CollectionPresenter);
        expect(presenter).toEqual(new UserPresenter.CollectionPresenter(output));
        expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams);
    });
});
