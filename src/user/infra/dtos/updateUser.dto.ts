import { UpdateUserUseCase } from "@/user/application/useCases/updateUserUseCase/UpdateUserUseCase";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, "id"> {
    name: string;
}