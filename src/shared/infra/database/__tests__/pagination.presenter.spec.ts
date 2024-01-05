import { instanceToPlain } from "class-transformer";
import { PaginationPresenter } from "../../presenters/pagination.presenter";

describe("Pagination presenter unit tests", () => {

    describe("Constructor method", () => {
        it("Should define values", async () => {
            const props: PaginationPresenter.PaginationPresenterProps = {
                currentPage: 1,
                perPage: 15,
                lastPage: 3,
                total: 35
            },
                SUT = new PaginationPresenter.Presenter(props);

            for (const key in props) {
                expect(SUT[key]).toStrictEqual(props[key]);
            }
        });

        it("Should convert the values before setting them", async () => {
            const props: PaginationPresenter.PaginationPresenterProps = {
                currentPage: "1" as any,
                perPage: "15" as any,
                lastPage: "3" as any,
                total: "35" as any
            },
                SUT = new PaginationPresenter.Presenter(props);

            for (const key in props) {
                expect(SUT[key]).toStrictEqual(props[key]);
            }
        });

        it("Should presenter data", async () => {
            let props: PaginationPresenter.PaginationPresenterProps = {
                currentPage: 1,
                perPage: 15,
                lastPage: 3,
                total: 35
            };

            let SUT = new PaginationPresenter.Presenter(props),
                output = instanceToPlain(SUT);
            expect(output).toStrictEqual(props);

            props = {
                currentPage: "1" as any,
                perPage: "15" as any,
                lastPage: "3" as any,
                total: "35" as any
            };

            SUT = new PaginationPresenter.Presenter(props);
            output = instanceToPlain(SUT);
            
            for (const key in props) {
                props[key] = Number(props[key]);
            }

            expect(output).toStrictEqual(props);
        });
    });
});