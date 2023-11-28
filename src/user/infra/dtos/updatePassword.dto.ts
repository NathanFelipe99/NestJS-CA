import { UpdatePasswordUseCase } from "@/user/application/useCases/updatePasswordUseCase/UpdatePasswordUseCase";

export class UpdatePasswordDTO implements Omit<UpdatePasswordUseCase.Input, "id"> {
    currentPassword: string;
    newPassword: string;
}