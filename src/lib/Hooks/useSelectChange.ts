import {SelectApiType} from "../../type/zodTypes.ts";
import {useGetConfigQuery, useUpdateSelectOptionsMutation} from "../../redux/services/calculatorApi.ts";
import {OptionSelectType} from "../../components/InputForm/InputForm.tsx";
import React, {Dispatch, SetStateAction} from "react";

export const useSelectChange = (
    setChoiceOfFrame: Dispatch<SetStateAction<string>>,
    setChoiceOfMaterial: Dispatch<SetStateAction<string>>
) => {

    const [updateSelectOptions] = useUpdateSelectOptionsMutation();
    const {data: config} = useGetConfigQuery();

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, type: OptionSelectType) => {
        const selectValue = event.target.value;

        const updateOption = (key: string, value: string) => {
            updateSelectOptions({[key]: value});
        };

        switch (type) {
            case "list":
                updateOption("listValue", selectValue);
                break;
            case "pipe":
                updateOption("pipeValue", selectValue);
                break;
            case "material": {
                const selectedKey = config?.find(({name}) => name === selectValue);
                if (selectedKey?.key) {
                    setChoiceOfMaterial(selectValue)
                    updateOption("choiceOfMaterial", selectedKey.key as SelectApiType['choiceOfMaterial']);
                }
                break;
            }
            case "frame": {
                const selectedKey = config?.find(({name}) => name === selectValue);
                if (selectedKey?.key) {
                    setChoiceOfFrame(selectValue)
                    updateOption("choiceOfFrame", selectedKey.key as SelectApiType['choiceOfFrame']);
                }
                break;
            }
        }
    };
    return {handleSelectChange};
}
