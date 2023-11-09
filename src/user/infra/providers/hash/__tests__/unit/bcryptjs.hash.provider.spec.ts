import { BcryptJsHashProvider } from "../../bcryptjs.hash.provider";

describe("Bcryptjs hash provider unit tests", () => {
    let SUT: BcryptJsHashProvider,
        password: string,
        hashedPassword: string;

    beforeEach(async () => {
        SUT = new BcryptJsHashProvider();
        password = "newtest123";
        hashedPassword = await SUT.generateHash(password);
    });

    it("Should return encrypted password", async () => {
        expect(hashedPassword).toBeDefined();
        expect(typeof hashedPassword).toBe("string");
    });

    it("Should return false when comparison is invalid", async () => {
        const result = await SUT.compareHash("test", hashedPassword);
        expect(result).toBeFalsy();
    });

    it("Should return true when comparison match", async () => {
        const result = await SUT.compareHash(password, hashedPassword);
        expect(result).toBeTruthy();
    });
});