import { ConflictError } from "@/shared/domain/errors/ConflictError";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { InMemoryRepository } from "@/shared/domain/repositories/inMemory.repository";
import { InMemorySearchableRepository } from "@/shared/domain/repositories/inMemory.searchable.repository";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { IUserRepository } from "@/user/domain/repositories/user.repository.contracts";

export class UserInMemoryRepository extends InMemorySearchableRepository<UserEntity> implements IUserRepository {
    async findByEmail(email: string): Promise<UserEntity> {
        const _email = `${email}`;

        const entity = this.items.find(item => item.email === _email);
        if (!entity) throw new NotFoundError(`Entity not found using email ${_email}!`);

        return entity;
    }

    async emailExists(email: string): Promise<void> {
        const _email = `${email}`;

        const entity = this.items.find(item => item.email === _email);
        if (entity) throw new ConflictError("Email address already in use!");
    }

}