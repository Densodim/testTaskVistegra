import {z} from "zod";
import {Remap} from "./Types.ts";

export const Materials = z.object({
    type: z.union([
        z.literal('list'),
        z.literal('pipe'),
        z.literal('fix'),
    ]),
    name: z.string(),
    material: z.union([
        z.literal('plastic'),
        z.literal('metal'),
    ]),
    unit: z.union([
        z.literal('м2'),
        z.literal('мп'),
        z.literal('шт'),
    ]),
    width: z.number().optional(),
    price: z.number().min(0),
})

export const Configuration = z.object({
    type: z.union([
        z.literal('size'),
        z.literal('frame'),
        z.literal('material'),
        z.literal('fix'),
    ]),
    key: z.union([
        z.literal('length'),
        z.literal('width'),
        z.literal('standard'),
        z.literal('strong'),
        z.literal('metal'),
        z.literal('plastic'),
    ]),
    name: z.string(),
    min: z.number().min(0).optional(),
    max: z.number().min(1).optional(),
    step: z.number().min(0).optional(),
    value: z.number().min(0).optional(),
})

export const SelectsOptions = z.object({
    listValue: z.string(),
    pipeValue: z.string(),
    choiceOfFrame: z.union([
        z.literal('light'),
        z.literal('standard'),
        z.literal('strong')
    ]),
    choiceOfMaterial: z.union([
        z.literal('metal'),
        z.literal('plastic')
    ])
})


//types
export type MaterialsApiType = Remap<z.infer<typeof Materials>>;
export type ConfigurationApiType = z.infer<typeof Configuration>;
export type SelectApiType = z.infer<typeof SelectsOptions>