import { SignUpUseCase } from "@/user/application/useCases/signUpUseCase/SignUpUseCase";

export class SignUpDTO implements SignUpUseCase.Input {
    name: string;
    email: string;
    password: string;
}