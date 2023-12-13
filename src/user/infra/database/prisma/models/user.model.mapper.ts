import { ValidationError } from "@/shared/domain/errors/ValidationError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { User } from "@prisma/client";

export class UserModelMapper {
    static toEntity(model: User) {
        try {
            return new UserEntity(model, model.id);
        } catch (error) {
            throw new ValidationError("The entity hasn't been loaded.");
        }
    }
}