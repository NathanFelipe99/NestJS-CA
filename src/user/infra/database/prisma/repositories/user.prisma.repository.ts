import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { PrismaService } from "@/shared/infra/database/prisma/prisma.service";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserModelMapper } from "../models/user.model.mapper";
import { ConflictError } from "@/shared/domain/errors/ConflictError";

export class UserPrismaRepository implements UserRepository.Repository {
    constructor(private databaseService: PrismaService) { }

    sortableFiels: string[] = ["name", "createdAt"];

    async findByEmail(email: string): Promise<UserEntity> {
        try {
            const user = await this.databaseService.user.findUnique({
                where: { email }
            });

            return UserModelMapper.toEntity(user);
        } catch {
            throw new NotFoundError(`UserModel not found using email ${email}`);
        }
    }

    async emailExists(email: string): Promise<void> {
        const user = await this.databaseService.user.findUnique({
            where: { email }
        });

        if (user) {
            throw new ConflictError("Email address already exists!");
        }
    }

    async search(props: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        const sortable = this.sortableFiels?.includes(props.sortField) || false;
        const orderByField = sortable ? props.sortField : "createdAt",
            orderByDirection = sortable ? props.sortDir : "DESC";

        const count = await this.databaseService.user.count({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: "insensitive"
                    }
                }
            })
        });

        const models = await this.databaseService.user.findMany({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: "insensitive"
                    }
                }
            }),
            orderBy: {
                [orderByField]: orderByDirection.toLowerCase()
            },
            skip: props.page && (props.page > 0 ? (props.page - 1) * props.perPage : 1),
            take: props.perPage && (props.perPage > 0 ? props.perPage : 15)
        });

        return new UserRepository.SearchResult({
            items: models.map(item => UserModelMapper.toEntity(item)),
            total: count,
            currentPage: props.page,
            perPage: props.perPage,
            sortField: orderByField,
            sortDir: orderByDirection,
            filter: props.filter
        });
    }

    async insert(entity: UserEntity): Promise<void> {
        await this.databaseService.user.create({ data: entity.toJSON() });
    }

    async findById(id: string): Promise<UserEntity> {
        return this._get(id);
    }

    async findAll(): Promise<UserEntity[]> {
        const models = await this.databaseService.user.findMany();
        return models.map((model) => UserModelMapper.toEntity(model));
    }

    async update(data: UserEntity): Promise<void> {
        await this._get(data._id);
        await this.databaseService.user.update({
            data: data.toJSON(),
            where: {
                id: data._id
            }
        });
    }

    async delete(id: string): Promise<void> {
        await this._get(id);
        await this.databaseService.user.delete({
            where: { id }
        });
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