import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put, HttpException } from "@nestjs/common";
import { SignUpDTO } from "./dtos/signUp.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { SignUpUseCase } from "../application/useCases/signUpUseCase/SignUpUseCase";
import { SignInUseCase } from "../application/useCases/signInUseCase/SignInUseCase";
import { ListUsersUseCase } from "../application/useCases/listUsersUseCase/ListUsersUseCase";
import { FindUserByIdUseCase } from "../application/useCases/findUserByIdUseCase/FindUserByIdUseCase";
import { UpdatePasswordUseCase } from "../application/useCases/updatePasswordUseCase/UpdatePasswordUseCase";
import { UpdateUserUseCase } from "../application/useCases/updateUserUseCase/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/useCases/deleteUserUseCase/DeleteUserUseCase";
import { ListUsersDTO } from "./dtos/listUsers.dto";
import { UpdatePasswordDTO } from "./dtos/updatePassword.dto";
import { SignInDTO } from "./dtos/signIn.dto";
import { UserOutput } from "../application/dto/userOutput";
import { UserPresenter } from "./presenters/user.presenter";

@Controller("user")
export class UserController {

    static userToResponse(output: UserOutput) {
        return new UserPresenter.Presenter(output);
    }

    static userListToResponse(output: ListUsersUseCase.Output) {
        return new UserPresenter.CollectionPresenter(output);
    }

    @Inject(SignUpUseCase.UseCase)
    private signUpUseCase: SignUpUseCase.UseCase;

    @Inject(SignInUseCase.UseCase)
    private signInUseCase: SignInUseCase.UseCase;

    @Inject(ListUsersUseCase.UseCase)
    private listUsersUseCase: ListUsersUseCase.UseCase;

    @Inject(FindUserByIdUseCase.UseCase)
    private findUserByIdUseCase: FindUserByIdUseCase.UseCase;

    @Inject(UpdateUserUseCase.UseCase)
    private updateUserUseCase: UpdateUserUseCase.UseCase;

    @Inject(UpdatePasswordUseCase.UseCase)
    private updatePasswordUseCase: UpdatePasswordUseCase.UseCase;

    @Inject(DeleteUserUseCase.UseCase)
    private deleteUserUseCase: DeleteUserUseCase.UseCase;

    @Post()
    async create(@Body() data: SignUpDTO) {
        try {
            const output = await this.signUpUseCase.execute(data);
            return UserController.userToResponse(output);  
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() data: SignInDTO) {
        try {
            const output = await this.signInUseCase.execute(data);
            return UserController.userToResponse(output);   
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @Get()
    async search(@Query() searchParams: ListUsersDTO) {
        try {
            const output = await this.listUsersUseCase.execute(searchParams);
            return UserController.userListToResponse(output);
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        try {
            const output = await this.findUserByIdUseCase.execute({ id });
            return UserController.userToResponse(output);
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() data: UpdateUserDto) {
        try {
            const output = await this.updateUserUseCase.execute({ id, ...data });
            return UserController.userToResponse(output);
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @Patch(":id")
    async updatePassword(@Param("id") id: string, data: UpdatePasswordDTO) {
        try {
            const output = await this.updatePasswordUseCase.execute({ id, ...data });
            return UserController.userToResponse(output);
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }

    @HttpCode(204)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        try {
            await this.deleteUserUseCase.execute({ id });
        } catch (error) {
            const { message, status = 400 } = error;
            return new HttpException(message, status);
        }
    }
}
