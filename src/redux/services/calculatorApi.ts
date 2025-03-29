import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ConfigurationApiType, MaterialsApiTypeOut, SelectApiType } from "../../type/zodTypes.ts"

export const calculatorAPI = createApi({
	reducerPath: "calculatorApi",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
	tagTypes: ["Materials", "Config", "SelectsOptions"],
	endpoints: (builder) => ({
		getMaterials: builder.query<MaterialsApiTypeOut[], void>({
			query: () => "materials",
			providesTags: [{ type: "Materials", id: "LIST" }],
		}),
		getConfig: builder.query<ConfigurationApiType[], void>({
			query: () => `config`,
			providesTags: [{ type: "Config", id: "SETTINGS" }],
		}),
		getSelectOptions: builder.query<SelectApiType, void>({
			query: () => "select",
			providesTags: [{ type: "SelectsOptions", id: "SELECT" }],
		}),
		updateConfig: builder.mutation<
			ConfigurationApiType,
			Partial<ConfigurationApiType> & { key: string }
		>({
			query: ({ key, ...patch }) => ({
				url: `config`,
				method: "POST",
				body: { key, ...patch },
			}),
			invalidatesTags: [{ type: "Config", id: "SETTINGS" }],
			async onQueryStarted({ key, ...patch }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					calculatorAPI.util.updateQueryData("getConfig", undefined, (draft) => {
						const item = draft.find((config) => config.key === key)
						if (item) Object.assign(item, patch)
					}),
				)
				try {
					await queryFulfilled
				} catch {
					patchResult.undo()
				}
			},
		}),
		updateSelectOptions: builder.mutation<SelectApiType, Partial<SelectApiType>>({
			query: ({ ...path }) => ({
				url: "select",
				method: "POST",
				body: { ...path },
			}),
			invalidatesTags: [{ type: "SelectsOptions", id: "SELECT" }],
			async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					calculatorAPI.util.updateQueryData("getSelectOptions", undefined, (draft) => {
						Object.keys(patch).forEach((key) => {
							;(draft as any)[key] = patch[key as keyof SelectApiType]
						})
					}),
				)
				try {
					await queryFulfilled
				} catch {
					patchResult.undo()
				}
			},
		}),
	}),
})

export const {
	useGetMaterialsQuery,
	useGetConfigQuery,
	useUpdateConfigMutation,
	useGetSelectOptionsQuery,
	useUpdateSelectOptionsMutation,
} = calculatorAPI
