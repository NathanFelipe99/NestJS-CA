import { SignInUseCase } from "@/user/application/useCases/signInUseCase/SignInUseCase";

export class SignInDTO implements SignInUseCase.Input {
    email: string;
    password: string;
}