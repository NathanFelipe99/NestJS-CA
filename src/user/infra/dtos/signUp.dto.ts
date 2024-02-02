import { SignUpUseCase } from "@/user/application/useCases/signUpUseCase/SignUpUseCase";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDTO implements SignUpUseCase.Input {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}