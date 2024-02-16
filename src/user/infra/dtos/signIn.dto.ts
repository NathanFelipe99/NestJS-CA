import { SignInUseCase } from "@/user/application/useCases/signInUseCase/SignInUseCase";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDTO implements SignInUseCase.Input {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}