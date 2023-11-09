import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { compare, hash } from "bcryptjs";

export class BcryptJsHashProvider implements IHashProvider{
    async generateHash(payload: string): Promise<string> {
        return hash(payload, 8);
    }
    async compareHash(payload: string, hash: string): Promise<boolean> {
        return compare(payload, hash);
    }
}