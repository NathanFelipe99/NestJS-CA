import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { PrismaService } from "@/shared/infra/database/prisma/prisma.service";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserModelMapper } from "../models/user.model.mapper";

export class UserPrismaRepository implements UserRepository.Repository {
    constructor(private databaseService: PrismaService) { }

    sortableFiels: string[];

    async findByEmail(email: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async emailExists(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async search(props: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        throw new Error("Method not implemented.");
    }

    async insert(entity: UserEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<UserEntity> {
        return this._get(id);
    }

    async findAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    async update(data: UserEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected async _get(id: string): Promise<UserEntity> {
        try {
            const user = await this.databaseService.user.findUnique({ where: { id } });
            
            return UserModelMapper.toEntity(user);
        } catch (error) {
            throw new NotFoundError(`UserModel not found using ID ${id}`);
        }
    }
}