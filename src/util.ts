export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createSingletonGetter<T>(constructor: new () => T): () => T {
    let memo: T | undefined = undefined;

    return () => {
        if (!memo) {
            memo = new constructor();
        }

        return memo;
    };
}
