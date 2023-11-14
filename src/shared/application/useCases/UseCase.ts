export interface UseCase<Input, Output> {
    execute(data: Input): Output | Promise<Output>;
}