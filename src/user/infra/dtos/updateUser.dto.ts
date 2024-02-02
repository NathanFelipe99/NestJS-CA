import { UpdateUserUseCase } from "@/user/application/useCases/updateUserUseCase/UpdateUserUseCase";
import { IsNotEmpty, IsString, isNotEmpty } from "class-validator";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, "id"> {
    @IsString()
    @IsNotEmpty()
    name: string;
}