import style from './InputForm.module.css';
import {
    useGetConfigQuery,
    useGetMaterialsQuery,
    useGetSelectOptionsQuery,
    useUpdateConfigMutation,
} from "../../redux/services/calculatorApi.ts";
import {AllOrNone} from "../../type/Types.ts";
import {AComponentUsingInput} from "../../lib/Input/Input.tsx";
import {useEffect, useState} from "react";
import {ConfigurationApiType, MaterialsApiType} from "../../type/zodTypes.ts";
import {useSelectChange} from "../../lib/Hooks/useSelectChange.ts";
import {useOptionSelect} from "../../lib/Hooks/useOptionSelect.tsx";
import {useGetSizeConfig} from "../../lib/Hooks/useGetSizeConfig.ts";


function InputForm() {

    const { error: materialsError, isLoading: materialsIsLoading} = useGetMaterialsQuery();
    const {data: config, error: configError, isLoading: configIsLoading} = useGetConfigQuery();
    const {data: selectValue} = useGetSelectOptionsQuery()

    const [updateConfig] = useUpdateConfigMutation();
    const {optionSelect} = useOptionSelect();
    const {getSizeConfig} = useGetSizeConfig();

    const [choiceOfMaterial, setChoiceOfMaterial] = useState('');
    const [choiceOfFrame, setChoiceOfFrame] = useState('');
    const [form, setForm] = useState({
        width: getSizeConfig("width")?.min ?? 0,
        length: getSizeConfig("length")?.value ?? 0,
        material: "",
        pipe: "",
        frame: "",
    });

    const {handleSelectChange} = useSelectChange(setChoiceOfFrame, setChoiceOfMaterial);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            width: getSizeConfig("width")?.min ?? prev.width,
            length: getSizeConfig("length")?.min ?? prev.length,
        }));
    }, []);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            width: getSizeConfig("width")?.value ?? prev.width,
            length: getSizeConfig("length")?.value ?? prev.length,
        }));
    }, [config]);

    useEffect(() => {
        if (selectValue) {
            const choiceOfFrameName = config?.find(({key}) => key === selectValue.choiceOfFrame);
            const choiceOfMaterialName = config?.find(({key}) => key === selectValue.choiceOfMaterial);
            if (choiceOfFrameName) {
                setChoiceOfFrame(choiceOfFrameName.name);
            }
            if (choiceOfMaterialName) {
                setChoiceOfMaterial(choiceOfMaterialName.name);
            }
        }
    }, [selectValue, config]);

    const handleChange = async (key: any, value: number) => {
        setForm((prev) => ({...prev, [key]: value}));

        await updateConfig({
            key,
            value,
        });
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
                    <select onChange={(e) => handleSelectChange(e, 'list')} value={selectValue?.listValue}>
                        {optionSelect('list')}
                    </select>

                    <label>Труба:</label>
                    <select onChange={(e) => handleSelectChange(e, 'pipe')} value={selectValue?.pipeValue}>
                        {optionSelect('pipe')}
                    </select>

                    <label>Ширина (м):</label>
                    <AComponentUsingInput type={'number'} getSizeConfig={getSizeConfig('width')} value={form.width}
                                          onChange={(value: number) => handleChange('width', value)}/>

                    <label>Длина (м):</label>
                    <AComponentUsingInput type={'number'} getSizeConfig={getSizeConfig('length')} value={form.length}
                                          onChange={(value: number) => handleChange('length', value)}/>

                    <label>выбор материала:</label>
                    <select onChange={(e) => handleSelectChange(e, 'material')} value={choiceOfMaterial}>
                        {optionSelect('material')}
                    </select>

                    <label>выбор прочности:</label>
                    <select onChange={(e) => handleSelectChange(e, 'frame')} value={choiceOfFrame}>
                        {optionSelect('frame')}
                    </select>
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
export type OptionSelectType = MaterialsApiType['type'] | ConfigurationApiType['type']
export type SizeConfigType = ConfigurationApiType['key']

export type GetSizeConfigType = AllOrNone<ConfigurationApiType, 'min' | 'max' | 'step' | 'value'>


