import { Entity } from "../entities/Entity";
import { NotFoundError } from "../errors/NotFoundError";
import { IRepository } from "./repository.contracts";

export abstract class InMemoryRepository<E extends Entity> implements IRepository<E> {
    items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
    }

    async findById(id: string): Promise<E> {
        return this._get(id);
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    async update(entity: E): Promise<void> {
        await this._get(entity.id);
        const foundIndex = await this._getIndex(entity.id);
        this.items[foundIndex] = entity;
    }

    async delete(id: string): Promise<void> {
        await this._get(id);
        const foundIndex = await this._getIndex(id);
        this.items.slice(foundIndex, 1);
    }

    protected async _get(id: string): Promise<E> {
        const _id = `${id}`;
        const entity = this.items.find(item => item._id === _id);
        if (!entity) throw new NotFoundError("Entity not found!");

        return entity;
    }

    protected async _getIndex(id: string): Promise<number> {
        const _id = `${id}`;
        const index = this.items.findIndex(item => item._id === _id);
        if (index < 0) throw new NotFoundError("Entity index not found!");
        return index;
    }
}