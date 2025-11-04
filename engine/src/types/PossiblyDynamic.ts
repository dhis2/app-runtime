export type PossiblyDynamic<Type, InputType> =
    | Type
    | ((input: InputType) => Type)
