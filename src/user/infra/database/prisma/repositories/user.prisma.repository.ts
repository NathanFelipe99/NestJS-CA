import { PrismaService } from "@/shared/infra/database/prisma/prisma.service";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";

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
        throw new Error("Method not implemented.");
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
}