import {JSX} from "react";
import {OnlyRequired, Remap} from "../../type/Types.ts";
import {GetSizeConfigType} from "../../components/InputForm/InputForm.tsx";


function Input({...allProps}: InputProps) {
    return (<input {...allProps} />)
}

export function AComponentUsingInput({getSizeConfig, onChange, value, ...rest}: any) {
    const {max, min, step} = getSizeConfig

    return <Input value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step} {...rest}/>
}


//type
type ControlledProps = OnlyRequired<JSX.IntrinsicElements['input'], 'value' | 'onChange'> & {
    defaultValue?: never
}

type UncontrolledProps = Omit<JSX.IntrinsicElements['input'], 'value' | 'onChange'> & {
    defaultValue: string
    value?: never
    onChange?: never
    getSizeConfig?: GetSizeConfigType
}

type InputProps = Remap<ControlledProps | UncontrolledProps>
