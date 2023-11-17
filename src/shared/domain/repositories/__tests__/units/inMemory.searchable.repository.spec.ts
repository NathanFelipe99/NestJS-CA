import { Entity } from "@/shared/domain/entities/Entity";
import { InMemorySearchableRepository } from "../../inMemory.searchable.repository";
import { SearchParams, SearchProps, SearchResult } from "../../searchable-repository.contracts";

type StubEntityProps = {
    name: string;
    price: number;
};

class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity>{
    sortableFiels: string[] = ["name", "price"];
    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
        if (!filter) {
            return items;
        }

        return items.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase());
        });
    }
}

describe("Testing SearchableRepository", () => {
    let SUT: StubInMemorySearchableRepository;

    beforeEach(() => {
        SUT = new StubInMemorySearchableRepository();
    });

    describe("Testing applyFilter method", () => {
        it("Should receive items when filter is null", async () => {
            const items = [new StubEntity({ name: "Lollipop", price: 1 })];

            const spyFilterMethod = jest.spyOn(items, "filter");
            const filteredItems = await SUT["applyFilter"](items, null);

            expect(filteredItems).toStrictEqual(items);
            expect(spyFilterMethod).not.toHaveBeenCalled();
        });

        it("Should filter using a filter param", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 1 }),
                new StubEntity({ name: "Balloon", price: 2 }),
                new StubEntity({ name: "balloon", price: 3 })
            ];

            const spyFilterMethod = jest.spyOn(items, "filter");
            const filteredItems = await SUT["applyFilter"](items, "ball");

            expect(filteredItems).toHaveLength(2);
            expect(filteredItems).toStrictEqual([...[items[1], items[2]]]);
            expect(spyFilterMethod).toHaveBeenCalledTimes(1);
        });

        it("Should return an empty array if the filtrer doesn't match any item name", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 1 }),
                new StubEntity({ name: "Balloon", price: 2 }),
                new StubEntity({ name: "balloon", price: 3 })
            ];

            const spyFilterMethod = jest.spyOn(items, "filter");
            const filteredItems = await SUT["applyFilter"](items, "test");

            expect(filteredItems).toHaveLength(0);
            expect(spyFilterMethod).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing applySort method", () => {
        it("Should receive items when sortField is null or not included in sortable fields", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 1 }),
                new StubEntity({ name: "Balloon", price: 1 }),
            ];

            const spySortMethod = jest.spyOn(items, "sort");
            let itemsSorted = await SUT["applySort"](items, null, "");
            expect(itemsSorted).toStrictEqual(items);
            expect(spySortMethod).not.toHaveBeenCalled();

            itemsSorted = await SUT["applySort"](items, "price", "");
            expect(itemsSorted.map(item => item.props)).toStrictEqual(items.map(item => item.props));
            expect(spySortMethod).not.toHaveBeenCalled();
        });

        it("Should receive items when sortDir is null", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 1 }),
                new StubEntity({ name: "Balloon", price: 1 }),
            ];

            const itemsSorted = await SUT["applySort"](items, "name", "");
            expect(itemsSorted).toStrictEqual([...items]);
        });


        it("Should receive items ordered when sortDir isn't null", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 10 }),
                new StubEntity({ name: "Balloon", price: 20 }),
                new StubEntity({ name: "Chicken Legs", price: 5 })
            ];

            let itemsSorted = await SUT["applySort"](items, "name", "ASC");
            expect(itemsSorted).toStrictEqual([...[items[1], items[2], items[0]]]);

            itemsSorted = await SUT["applySort"](items, "name", "DESC");
            expect(itemsSorted).toStrictEqual([...[items[0], items[2], items[1]]]);
        });
    });

    describe("Testing applyPaginate method", () => {
        it("Should paginate items", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 10 }),
                new StubEntity({ name: "Balloon", price: 20 }),
                new StubEntity({ name: "Chicken Legs", price: 5 }),
                new StubEntity({ name: "Scooby Snacks", price: 50 }),
                new StubEntity({ name: "Square Ball", price: 25 })
            ];

            let itemsPaginated = await SUT["applyPaginate"](items, 1, 3);
            expect(itemsPaginated).toHaveLength(3);
            expect(itemsPaginated).toStrictEqual([...[items[0], items[1], items[2]]]);
            itemsPaginated = await SUT["applyPaginate"](items, 2, 3);
            expect(itemsPaginated).toHaveLength(2);
            expect(itemsPaginated).toStrictEqual([...[items[3], items[4]]]);

            itemsPaginated = await SUT["applyPaginate"](items, 2, 4);
            expect(itemsPaginated).toHaveLength(1);
            expect(itemsPaginated).toStrictEqual([items[4]]);
        });
    });

    describe("Testing search method", () => {
        it("Should only apply pagination when other params are null", async () => {
            const entity = new StubEntity({ name: "Lollipop", price: 2 });

            const items = Array(16).fill(entity);
            SUT.items = items;

            const customSearch = await SUT.search(new SearchParams());
            expect(customSearch).toStrictEqual(
                new SearchResult({
                    items: Array(15).fill(entity),
                    total: 16,
                    currentPage: 1,
                    perPage: 15,
                    sortField: null,
                    sortDir: null,
                    filter: null
                })
            );
        });

        it("Should only apply filter and pagination", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 10 }),
                new StubEntity({ name: "Balloon", price: 20 }),
                new StubEntity({ name: "Chicken Legs", price: 5 }),
                new StubEntity({ name: "Scooby Snacks", price: 50 }),
                new StubEntity({ name: "Square Ball", price: 25 }),
                new StubEntity({ name: "Football Card", price: 25 }),
            ];

            SUT.items = items;
            let searchParamsProps: SearchProps = {
                page: 1,
                perPage: 2,
                filter: "ball"
            };

            let customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(2);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[1], items[4]],
                total: items.length,
                currentPage: 1,
                perPage: 2,
                sortField: null,
                sortDir: null,
                filter: "ball"
            }));

            searchParamsProps = {
                page: 2,
                perPage: 3,
                filter: "ll"
            };

            customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(1);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[5]],
                total: items.length,
                currentPage: 2,
                perPage: 3,
                sortField: null,
                sortDir: null,
                filter: "ll"
            }));
        });

        it("Should only apply sort and pagination", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 10 }),
                new StubEntity({ name: "Balloon", price: 20 }),
                new StubEntity({ name: "Chicken Legs", price: 5 }),
                new StubEntity({ name: "Scooby Snacks", price: 50 }),
                new StubEntity({ name: "Square Ball", price: 25 }),
                new StubEntity({ name: "Football Card", price: 60 }),
                new StubEntity({ name: "Teddy Bear", price: 30 })
            ];

            SUT.items = items;
            let searchParamsProps: SearchProps = {
                page: 2,
                perPage: 3,
                sortField: "name",
                sortDir: "ASC"
            };

            let customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(3);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[0], items[3], items[4]],
                total: items.length,
                currentPage: 2,
                perPage: 3,
                sortField: "name",
                sortDir: "ASC",
                filter: null
            }));

            searchParamsProps = {
                page: 3,
                perPage: 2,
                sortDir: "DESC",
                sortField: "price"
            };

            customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(2);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[1], items[0]],
                total: items.length,
                currentPage: 3,
                perPage: 2,
                sortField: "price",
                sortDir: "DESC",
                filter: null
            }));
        });

        it("Should apply filter, sort and pagination", async () => {
            const items = [
                new StubEntity({ name: "Lollipop", price: 10 }),
                new StubEntity({ name: "Balloon", price: 20 }),
                new StubEntity({ name: "Chicken Legs", price: 5 }),
                new StubEntity({ name: "Scooby Snacks", price: 50 }),
                new StubEntity({ name: "Square Ball", price: 25 }),
                new StubEntity({ name: "Football Card", price: 35 }),
                new StubEntity({ name: "Teddy Bear", price: 30 }),
                new StubEntity({ name: "Snow Ball", price: 15 })
            ];

            SUT.items = items;
            let searchParamsProps: SearchProps = {
                page: 1,
                perPage: 3,
                sortField: "name",
                sortDir: "DESC",
                filter: "ball"
            };

            let customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(3);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[4], items[7], items[5]],
                total: items.length,
                currentPage: 1,
                perPage: 3,
                sortField: "name",
                sortDir: "DESC",
                filter: "ball"
            }));

            searchParamsProps = {
                page: 2,
                perPage: 2,
                sortField: "price",
                sortDir: "ASC",
                filter: "ll"
            };

            customSearch = await SUT.search(new SearchParams(searchParamsProps));
            expect(customSearch.items).toHaveLength(2);
            expect(customSearch).toStrictEqual(new SearchResult({
                items: [items[1], items[4]],
                total: items.length,
                currentPage: 2,
                perPage: 2,
                sortField: "price",
                sortDir: "ASC",
                filter: "ll"
            }));
        });
    });
});
