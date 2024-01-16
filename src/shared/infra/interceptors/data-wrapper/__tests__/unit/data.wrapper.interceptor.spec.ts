import { Observable, of } from "rxjs";
import { DataWrapperInterceptor } from "../../data.wrapper.interceptor";

describe("DataWrapperInterceptor", () => {
    let interceptor: DataWrapperInterceptor,
        props: object

    beforeEach(() => {
        interceptor = new DataWrapperInterceptor();
        props = {
            name: "Test",
            email: "test@mail.com",
            password: "123"
        };
    });

    it("Should wrapper the data", () => {
        const obs$ = interceptor.intercept({} as any, {
            handle: () => of(props)
        });

        obs$.subscribe({
            next: value => {
                expect(value).toEqual({ data: props });
            }
        });
    });

    it("Shouldn't wrapper the data when the response body doesn't have the 'meta' property", () => {
        const result = { data: [props], "meta": { total: 10 } };

        const obs$ = interceptor.intercept({} as any, {
            handle: () => of(result)
        });

        obs$.subscribe({
            next: value => {
                expect(value).toEqual(result);
            }
        });
    });
});
