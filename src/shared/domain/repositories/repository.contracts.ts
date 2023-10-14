import { Entity } from "../entities/Entity";

export interface IRepository<E extends Entity> {
    insert(entity: E): Promise<void>;
    findById(id: string): Promise<E>;
    findAll(): Promise<E[]>;
    update(entity: E): Promise<void>;
    inactivate(id: string): Promise<void>;
}