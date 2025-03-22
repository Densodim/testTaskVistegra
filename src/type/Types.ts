export type Types<T> = {
    [K in keyof T]: T[K]
}

export type GetRequired<T> = {
    [K in keyof T as T[K] extends Required<T>[K]
        ? K
        : never]: T[K]
}

export type RequiredKey<T> = keyof GetRequired<T>

export type OnlyRequired<T, K extends keyof T = keyof T> = Types<
    Required<Pick<T, K>> & Partial<Omit<T, K>>
>

export type SetOptional<T, K extends keyof T = keyof T> = Types<Partial<Pick<T, K>> & Omit<T, K>>

export type SelectPartial<T, K extends keyof T> = {
    [P in K]?: T[K];
}

export type ExactlyOne<T> = {
    [K in keyof T]: {
    [P in K]: T[P];
} & {
    [P in Exclude<keyof T, K>]?: never
}
}[keyof T]

export type Split<T> = {
    [K in keyof T]: {
        [P in K]: T[P]
    }
}[keyof T]

export type AllOrNone<T, Keys extends keyof T> = (
    | Required<Pick<T, Keys>>
    | Partial<Record<Keys, never>>
    ) & Split<T>

export type Remap<T> = {
    [K in keyof T]: T[K]
}