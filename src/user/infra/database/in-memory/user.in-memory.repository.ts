import { ConflictError } from "@/shared/domain/errors/ConflictError";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { InMemorySearchableRepository } from "@/shared/domain/repositories/inMemory.searchable.repository";
import { SortDirection } from "@/shared/domain/repositories/searchable-repository.contracts";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";

export class UserInMemoryRepository extends InMemorySearchableRepository<UserEntity> implements UserRepository.Repository {
    sortableFiels: string[] = ["name", "createdAt"];

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

    protected async applyFilter(items: UserEntity[], filter: UserRepository.Filter): Promise<UserEntity[]> {
        if (!filter) {
            return items;
        }

        return items.filter((item) => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase());
        });
    }

    protected async applySort(items: UserEntity[], sortField: string | null, sortDir: SortDirection | null): Promise<UserEntity[]> {
        return !sortField
            ? super.applySort(items, "createdAt", "DESC")
            : super.applySort(items, sortField, sortDir);
    }
}