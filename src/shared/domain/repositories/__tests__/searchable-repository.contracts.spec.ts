import { SearchParams, SearchResult, SearchResultProps } from "../searchable-repository.contracts";

describe("Searchable repository unit tests", () => {
    describe("SearchParams tests", () => {
        it("Page prop single test", () => {
            const SUT = new SearchParams();
            expect(SUT.page).toEqual(1);
        });

        it("Page prop batch test", () => {
            const params = [
                { page: null, expected: 1 },
                { page: undefined, expected: 1 },
                { page: "", expected: 1 },
                { page: 0, expected: 1 },
                { page: -1, expected: 1 },
                { page: 5.5, expected: 1 },
                { page: true, expected: 1 },
                { page: {}, expected: 1 },
                { page: 2, expected: 2 },
            ];

            params.forEach((param) => {
                const receivedProps = {
                    page: param.page as any
                };

                expect(new SearchParams(receivedProps).page).toEqual(param.expected);
            });
        });

        it("PerPage prop single test", () => {
            const SUT = new SearchParams();
            expect(SUT.perPage).toEqual(15);
        });

        it("PerPage prop batch test", () => {
            const params = [
                { perPage: null, expected: 15 },
                { perPage: undefined, expected: 15 },
                { perPage: "", expected: 15 },
                { perPage: 0, expected: 15 },
                { perPage: -1, expected: 15 },
                { perPage: 5.5, expected: 15 },
                { perPage: true, expected: 15 },
                { perPage: {}, expected: 15 },
                { perPage: 2, expected: 2 },
            ];

            params.forEach((param) => {
                const receivedProps = {
                    perPage: param.perPage as any
                };

                expect(new SearchParams(receivedProps).perPage).toEqual(param.expected);
            });
        });

        it("SortField prop single test", () => {
            const SUT = new SearchParams();
            expect(SUT.sortField).toBeNull();
        });
        
        it("SortField prop batch test", () => {
            const params = [
                { sortField: null, expected: null },
                { sortField: undefined, expected: null },
                { sortField: "", expected: null },
                { sortField: 0, expected: null },
                { sortField: -1, expected: "-1" },
                { sortField: 5.5, expected: "5.5" },
                { sortField: true, expected: null },
                { sortField: {}, expected: null },
                { sortField: "name", expected: "name"}
            ];

            params.forEach((param) => {
                const receivedProps = {
                    sortField: param.sortField as any
                };

                expect(new SearchParams(receivedProps).sortField).toEqual(param.expected);
            });
        });

        it("SortDir prop single test", () => {
            const SUT = new SearchParams();
            expect(SUT.sortDir).toBeNull();
        });

        it("SortDir prop batch test", () => {
            const params = [
                { sortDir: null, expected: null },
                { sortDir: undefined, expected: null },
                { sortDir: "", expected: null },
                { sortDir: 0, expected: null },
                { sortDir: -1, expected: "ASC" },
                { sortDir: 5.5, expected: "ASC" },
                { sortDir: true, expected: null },
                { sortDir: false, expected: null },
                { sortDir: {}, expected: null },
                { sortDir: "test", expected: "ASC" },
                { sortDir: "DESC", expected: "DESC" }
            ];

            params.forEach((param) => {
                const receivedProps = {
                    sortField: "name",
                    sortDir: param.sortDir as any
                };

                expect(new SearchParams(receivedProps).sortDir).toEqual(param.expected);
            });
        });

        it("Filter prop single test", () => {
            const SUT = new SearchParams();
            expect(SUT.filter).toBeNull();
        });

        it("Filter prop batch test", () => {
            const params = [
                { filter: null, expected: null },
                { filter: undefined, expected: null },
                { filter: "", expected: null },
                { filter: 0, expected: null },
                { filter: -1, expected: "-1" },
                { filter: 5.5, expected: "5.5" },
                { filter: true, expected: null },
                { filter: false, expected: null },
                { filter: {}, expected: null },
                { filter: "test", expected: "test" },
            ];

            params.forEach((param) => {
                const receivedProps = {
                    filter: param.filter as any
                };

                expect(new SearchParams(receivedProps).filter).toEqual(param.expected);
            });
        });
    });

    describe("SearchResult tests", () => {
        it("Constructor method", () => {
            const props = {
                items: ["test1", "test2", "test3", "test4"] as any,
                total: 4,
                currentPage: 1,
                perPage: 2,
                sortField: null,
                sortDir: null,
                filter: null
            };
            const SUT = new SearchResult(props);

            const expectedJSON = Object.assign(props, { lastPage: 2 });
            expect(SUT.toJSON()).toStrictEqual(expectedJSON)
        });

        it("LastPage prop test", () => {
            const props = {
                items: ["test1", "test2", "test3", "test4"] as any,
                total: 8,
                currentPage: 1,
                perPage: 2,
                sortField: null,
                sortDir: null,
                filter: null
            };
            const SUT = new SearchResult(props);

            expect(SUT.lastPage).toEqual(4);
        });

        it("LastPage prop test 2", () => {
            const props = {
                items: ["test1", "test2", "test3", "test4"] as any,
                total: 8,
                currentPage: 1,
                perPage: 16,
                sortField: null,
                sortDir: null,
                filter: null
            };
            const SUT = new SearchResult(props);

            expect(SUT.lastPage).toEqual(1);
        });
    });
});