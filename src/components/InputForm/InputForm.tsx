import style from './InputForm.module.css';
import {
    ConfigurationApiType,
    MaterialsApiType,
    SelectApiType,
    useGetConfigQuery,
    useGetMaterialsQuery,
    useGetSelectOptionsQuery,
    useUpdateConfigMutation,
    useUpdateSelectOptionsMutation
} from "../../redux/services/calculatorApi.ts";
import {AllOrNone} from "../../type/Types.ts";
import {AComponentUsingInput} from "../../lib/Input/Input.tsx";
import {useEffect, useState} from "react";


function InputForm() {

    const {data: materials, error: materialsError, isLoading: materialsIsLoading} = useGetMaterialsQuery();
    const {data: config, error: configError, isLoading: configIsLoading} = useGetConfigQuery();
    const {data: selectValue} = useGetSelectOptionsQuery()

    const [choiceOfMaterial, setChoiceOfMaterial] = useState('');
    const [choiceOfFrame, setChoiceOfFrame] = useState('');

    const [updateConfig] = useUpdateConfigMutation();
    const [updateSelectOptions] = useUpdateSelectOptionsMutation();


    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, type: OptionSelectType) => {
        const selectValue = event.target.value;
        switch (type) {
            case "list":
                updateSelectOptions({listValue: selectValue});
                break;
            case "pipe":
                updateSelectOptions({pipeValue: selectValue});
                break;
            case "material": {
                const selectedKey = config?.find(({name}) => name === selectValue);
                if (selectedKey?.key) {
                    setChoiceOfMaterial(selectValue)
                    updateSelectOptions({
                        choiceOfMaterial: selectedKey.key as SelectApiType['choiceOfMaterial']
                    });
                }
                break;
            }
            case "frame": {
                const selectedKey = config?.find(({name}) => name === selectValue);
                if (selectedKey?.key) {
                    setChoiceOfFrame(selectValue)
                    updateSelectOptions({
                        choiceOfFrame: selectedKey.key as SelectApiType['choiceOfFrame']
                    });
                }
                break;
            }
        }
    };

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

    const getSizeConfig = (key: SizeConfigType): GetSizeConfigType | undefined => {
        const sizeConfig = config?.find((item) => item.type === 'size' && item.key === key);
        return sizeConfig ? {
            min: sizeConfig.min ?? 0,
            max: sizeConfig.max ?? 0,
            step: sizeConfig.step ?? 0,
            value: sizeConfig.value ?? 0,
        } as GetSizeConfigType : undefined;
    }

    const [form, setForm] = useState({
        width: getSizeConfig("width")?.min ?? 0,
        length: getSizeConfig("length")?.value ?? 0,
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
type OptionSelectType = MaterialsApiType['type'] | ConfigurationApiType['type']
type SizeConfigType = ConfigurationApiType['key']

export type GetSizeConfigType = AllOrNone<ConfigurationApiType, 'min' | 'max' | 'step' | 'value'>


