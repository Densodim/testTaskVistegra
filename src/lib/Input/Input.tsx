import {OnlyRequired} from "../../type/Types.ts";
import {JSX} from "react";

export function Input({...allProps}: InputProps) {
    return (<input {...allProps} />)
}


//type
type ControlledProps = OnlyRequired<JSX.IntrinsicElements['input'], 'value' | 'onChange'> & {
    defaultValue?: never
}

type UncontrolledProps = Omit<JSX.IntrinsicElements['input'], 'value' | 'onChange'> & {
    defaultValue: string
    value?: never
    onChange?: never
}

type InputProps = ControlledProps | UncontrolledProps