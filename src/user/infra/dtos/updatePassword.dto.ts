import { UpdatePasswordUseCase } from "@/user/application/useCases/updatePasswordUseCase/UpdatePasswordUseCase";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDTO implements Omit<UpdatePasswordUseCase.Input, "id"> {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}