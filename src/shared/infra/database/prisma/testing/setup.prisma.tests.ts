import { execSync } from "node:child_process";

export default function setupPrismaTests() {
    execSync("npm run prisma-migrate:test");
}