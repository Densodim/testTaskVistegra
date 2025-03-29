import { GetSizeConfigType, SizeConfigType } from "../../components/InputForm/InputForm.tsx"
import { useGetConfigQuery } from "../../redux/services/calculatorApi.ts"

export const useGetSizeConfig = () => {
	const { data: config } = useGetConfigQuery()

	const getSizeConfig = (key: SizeConfigType): GetSizeConfigType | undefined => {
		const sizeConfig = config?.find((item) => item.type === "size" && item.key === key)
		return sizeConfig
			? ({
					min: sizeConfig.min ?? 0,
					max: sizeConfig.max ?? 0,
					step: sizeConfig.step ?? 0,
					value: sizeConfig.value ?? 0,
				} as GetSizeConfigType)
			: undefined
	}

	return { getSizeConfig }
}
