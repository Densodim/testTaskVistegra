import {OptionSelectType} from "../../components/InputForm/InputForm.tsx";
import {useGetConfigQuery, useGetMaterialsQuery} from "../../redux/services/calculatorApi.ts";

export const useOptionSelect = ()=>{

    const {data: materials} = useGetMaterialsQuery();
    const {data: config} = useGetConfigQuery();

    const optionSelect = (type: OptionSelectType) => {
        switch (type) {
            case 'list':
            case 'pipe':
            case 'fix':
                return materials?.filter((matetial) => matetial.type === type).map((item, index) => {
                    return <option key={index} value={item.name}>{item.name}</option>
                })
            case "frame":
            case "material":
            case "size":
                return config?.filter((el) => el.type === type).map((item, index) => {
                    return <option key={index} value={item.name}>{item.name}</option>
                })

        }
    }
    return {optionSelect}
}