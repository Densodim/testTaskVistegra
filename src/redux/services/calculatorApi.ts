import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {z} from "zod";
import {Remap} from "../../type/Types.ts";


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

export const calculatorAPI = createApi({
    reducerPath: 'calculatorApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001/'}),
    tagTypes: ["Materials", "Config", "SelectsOptions"],
    endpoints: (builder) => ({
        getMaterials: builder.query<MaterialsApiType[], void>({
            query: () => 'materials',
            providesTags: [{type: "Materials", id: "LIST"}]
        }),
        getConfig: builder.query<ConfigurationApiType[], void>({
            query: () => `config`,
            providesTags: [{type: "Config", id: "SETTINGS"}],
        }),
        getSelectOptions: builder.query<SelectApiType, void>({
            query: () => 'select',
            providesTags: [{type: "SelectsOptions", id: "SELECT"}]
        }),
        updateConfig: builder.mutation<ConfigurationApiType, Partial<ConfigurationApiType> & { key: string }>({
            query: ({key, ...patch}) => ({
                url: `config`,
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
        }),
        updateSelectOptions: builder.mutation<SelectApiType, Partial<SelectApiType>>({
            query: ({...path}) => ({
                url: 'select',
                method: "POST",
                body: {...path}
            }),
            invalidatesTags: [{type: "SelectsOptions", id: "SELECT"}],
            async onQueryStarted({...patch}, {dispatch, queryFulfilled}) {

                const patchResult = dispatch(
                    calculatorAPI.util.updateQueryData('getSelectOptions', undefined, (draft) => {
                        Object.keys(patch).forEach((key) => {
                            (draft as any)[key] = patch[key as keyof SelectApiType];
                        });
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

export const {
    useGetMaterialsQuery,
    useGetConfigQuery,
    useUpdateConfigMutation,
    useGetSelectOptionsQuery,
    useUpdateSelectOptionsMutation,
} = calculatorAPI;


//types


export type MaterialsApiType = Remap<z.infer<typeof Materials>>;
export type ConfigurationApiType = z.infer<typeof Configuration>;
export type SelectApiType = z.infer<typeof SelectsOptions>

