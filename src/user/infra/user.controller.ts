import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put } from "@nestjs/common";
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

@Controller("user")
export class UserController {
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
        return await this.signUpUseCase.execute(data);
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() data: SignUpDTO) {
        return await this.signInUseCase.execute(data);
    }

    @Get()
    async search(@Query() searchParams: ListUsersDTO) {
        return await this.listUsersUseCase.execute(searchParams);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.findUserByIdUseCase.execute({ id });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() data: UpdateUserDto) {
        return await this.updateUserUseCase.execute({ id, ...data });
    }

    @Patch(":id")
    async updatePassword(@Param("id") id: string, data: UpdatePasswordDTO) {
        return await this.updatePasswordUseCase.execute({ id, ...data });
    }

    @HttpCode(204)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.deleteUserUseCase.execute({ id });
    }
}
