import style from './InputForm.module.css';
import {
    ConfigurationType,
    MaterialsType,
    useGetConfigQuery,
    useGetMaterialsQuery
} from "../../redux/services/calculatorApi.ts";
import {AllOrNone} from "../../type/Types.ts";


function InputForm() {

    const {data: materials, error: materialsError, isLoading: materialsIsLoading} = useGetMaterialsQuery();
    const {data: config, error: configError, isLoading: configIsLoading} = useGetConfigQuery()


    // console.log('data', materials)
    // console.log('error', materialsError)
    // console.log('isLoading', materialsIsLoading)

    const optionSelect = (type: OptionSelectType) => {
        return materials?.filter((matetial) => matetial.type === type).map((item, index) => {
            return <option key={index} value={item.type}>{item.name}</option>
        })
    }

    const getSizeConfig = (key: SizeConfigType): GetSizeConfigType => {
        const sizeConfig = config?.find((item) => item.type === 'size' && item.key === key);
        return sizeConfig ? {min: sizeConfig.min, max: sizeConfig.max, step: sizeConfig.step} as GetSizeConfigType : {}
    }


    if (materialsIsLoading || configIsLoading) {
        return <div>Loading...</div>
    }
    if (!materialsIsLoading) {
        return (
            <>
                <h2>Настройки</h2>
                <div className={style.inputSection}>

                    <label>Покрытие:</label>
                    <select>
                        {optionSelect('list')}
                    </select>

                    <label>Труба:</label>
                    <select>
                        {optionSelect('pipe')}
                    </select>

                    <label>Ширина (м):</label>
                    <input type='number' min={getSizeConfig('width').min} max={getSizeConfig('width').max}
                           step={getSizeConfig('width').step}/>

                    <label>Длина (м):</label>
                    <input type='number'/>

                    <label>выбор прочности:</label>
                    <select>

                    </select>

                    <button>Рассчитать</button>
                </div>

            </>
        )
    } else {
        return (
            <>
                {materialsError || configError}
            </>
        )
    }


}


export default InputForm;

// types
type OptionSelectType = MaterialsType['type']
type SizeConfigType = ConfigurationType['key']

type GetSizeConfigType = AllOrNone<ConfigurationType, 'min' | 'max' | 'step'>

