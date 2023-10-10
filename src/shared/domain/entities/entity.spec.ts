import { v4 as uuidV4, validate as uuidValidate } from 'uuid';
import { Entity } from './Entity';
import { StubProps } from './types/stub.props';

class StubEntity extends Entity<StubProps>{

}

describe('Testing Entity Unit Test', () => {
    it('Should set a valid UUID', () => {
        const props = { prop1: 'A', prop2: 9 };
        const entity = new StubEntity(props);

        expect(entity.props).toStrictEqual(props);
        expect(entity._id).not.toBeNull();
        expect(uuidValidate(entity._id)).toBeTruthy();
    });
    
    it('Should accept props and ID', () => {
        const props = { prop1: 'A', prop2: 9 };
        const id = 'cf065174-3558-429e-8631-9a8e18b2c9ef';
        const entity = new StubEntity(props, id);

        expect(uuidValidate(entity._id)).toBeTruthy();
        expect(entity._id).toBe(id);
    });
    
    it('Should convert an entity to JSON', () => {
        const props = { prop1: 'A', prop2: 9 };
        const id = 'cf065174-3558-429e-8631-9a8e18b2c9ef';
        const entity = new StubEntity(props, id);
        
        expect(entity.toJSON()).toStrictEqual({ id, ...props });
    });
});