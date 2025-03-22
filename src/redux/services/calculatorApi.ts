import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {z} from "zod";


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

export const calculatorAPI = createApi({
    reducerPath: 'calculatorApi',
    baseQuery: fetchBaseQuery({baseUrl: '/data/'}),
    tagTypes: ["Materials", "Config"],
    endpoints: (builder) => ({
        getMaterials: builder.query<MaterialsType[], void>({
            query: () => 'data.json',
            providesTags: [{type: "Materials", id: "LIST"}]
        }),
        getConfig: builder.query<ConfigurationType[], void>({
            query: () => 'config.json',
            providesTags: [{type: "Config", id: "SETTINGS"}],
        }),
        updateConfig: builder.mutation<ConfigurationType, Partial<ConfigurationType> & { key: string }>({
            query: ({key, ...patch}) => ({
                url: `config.json`,
                method: "POST",
                body: {key, ...patch}
            }),
            invalidatesTags: [{type: "Config", id: "SETTINGS"}],
            async onQueryStarted({key, ...patch}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    calculatorAPI.util.updateQueryData('getConfig', undefined, (draft) => {
                        const item = draft.find((config) => config.key === key);
                        if (item) Object.assign(item, patch);
                    })
                )
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        })
    })
})

export const {useGetMaterialsQuery, useGetConfigQuery, useUpdateConfigMutation} = calculatorAPI;


//types


export type MaterialsType = z.infer<typeof Materials>;
export type ConfigurationType = z.infer<typeof Configuration>;

