import style from './InputForm.module.css';
import {
    ConfigurationType,
    MaterialsType,
    useGetConfigQuery,
    useGetMaterialsQuery, useUpdateConfigMutation
} from "../../redux/services/calculatorApi.ts";
import {AllOrNone} from "../../type/Types.ts";
import {AComponentUsingInput} from "../../lib/Input/Input.tsx";
import {useEffect, useState} from "react";


function InputForm() {

    const {data: materials, error: materialsError, isLoading: materialsIsLoading} = useGetMaterialsQuery();
    const {data: config, error: configError, isLoading: configIsLoading} = useGetConfigQuery();

    const [updateConfig] = useUpdateConfigMutation();


    // const sizeConfig = config?.find((item)=>item.key === 'width');
    // const minValue = sizeConfig?.min || 0;

    // const [minConfig, setMinConfig] = useState<number>(minValue);


    // console.log('data', materials)
    // console.log('error', materialsError)
    // console.log('isLoading', materialsIsLoading)

    const optionSelect = (type: OptionSelectType) => {
        return materials?.filter((matetial) => matetial.type === type).map((item, index) => {
            return <option key={index} value={item.type}>{item.name}</option>
        })
    }

    const getSizeConfig = (key: SizeConfigType): GetSizeConfigType | undefined => {
        const sizeConfig = config?.find((item) => item.type === 'size' && item.key === key);
        return sizeConfig ? {
            min: sizeConfig.min ?? 0,
            max: sizeConfig.max ?? 0,
            step: sizeConfig.step ?? 0
        } as GetSizeConfigType : undefined;
    }

    const [form, setForm] = useState({
        width: getSizeConfig("width")?.min ?? 0,
        length: getSizeConfig("length")?.min ?? 0,
        material: "",
        pipe: "",
        frame: "",
    });

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            width: getSizeConfig("width")?.min ?? prev.width,
            length: getSizeConfig("length")?.min ?? prev.length,
        }));
    }, [config]);

    const handleChange = async (key: any, value: number) => {
        setForm((prev) => ({...prev, [key]: value}));

        await updateConfig({key, value});
    };

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
                    <AComponentUsingInput type={'number'} getSizeConfig={getSizeConfig('width')} value={form.width}
                                          onChange={(value: number) => handleChange('width', value)}/>

                    <label>Длина (м):</label>
                    <AComponentUsingInput type={'number'} getSizeConfig={getSizeConfig('length')} value={form.length}
                                          onChange={(value: number) => handleChange('length', value)}/>

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

export type GetSizeConfigType = AllOrNone<ConfigurationType, 'min' | 'max' | 'step'>

