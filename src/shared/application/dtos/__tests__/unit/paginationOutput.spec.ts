import { SearchResult } from "@/shared/domain/repositories/searchable-repository.contracts";
import { PaginationOutputMapper } from "../../paginationOutput";

describe("PaginationOutputMapper unit tests", () => {
    it("Should convert a SearchResult in PaginationOutput", () => {
        const result = new SearchResult({
            items: ["test", "test2"] as any,
            total: 2,
            currentPage: 1,
            perPage: 2,
            sortField: "",
            sortDir: "",
            filter: "test"
        });

        const SUT = PaginationOutputMapper.toOutput(result.items, result);
        expect(SUT).toStrictEqual({
            items: result.items,
            total: 2,
            currentPage: 1,
            lastPage: 1,
            perPage: 2
        });
    });
});