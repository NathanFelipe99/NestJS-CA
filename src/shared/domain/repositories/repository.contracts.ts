import { Entity } from "../entities/Entity";

export interface IRepository<E extends Entity> {
    insert(entity: E): Promise<void>;
    findById(id: string): Promise<E>;
    findAll(): Promise<E[]>;
    update(data: E): Promise<void>;
    delete(id: string): Promise<void>;
}