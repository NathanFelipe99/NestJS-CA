import { instanceToPlain } from "class-transformer";
import { CollectionPresenter } from "../../presenters/collection.presenter";
import { PaginationPresenter } from "../../presenters/pagination.presenter";

class StubCollectionPresenterClass extends CollectionPresenter {
    data = [1, 2, 3];
}

describe("Collection presenter unit tests", () => {
    let SUT: StubCollectionPresenterClass,
        props: PaginationPresenter.Presenter;


    beforeEach(() => {
        props = {
            currentPage: 1,
            perPage: 10,
            lastPage: 2,
            total: 16
        };

        SUT = new StubCollectionPresenterClass(props);
    });

    describe("Constructor method", () => {
        it("Should define values", () => {
            expect(SUT["paginationPresenter"]).toBeInstanceOf(PaginationPresenter.Presenter);

            for (const key in props) {
                expect(SUT["paginationPresenter"][key]).toStrictEqual(props[key]);
            }
        });
    });

    it("Should presenter data", () => {
        const output = instanceToPlain(SUT);
        expect(output).toStrictEqual({
            data: [1, 2, 3],
            meta: props
        });
    });
});