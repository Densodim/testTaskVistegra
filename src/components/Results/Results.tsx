import styles from './Results.module.css';
import {useGetConfigQuery, useGetMaterialsQuery, useGetSelectOptionsQuery} from "../../redux/services/calculatorApi.ts";

const HEADER = {
    name: 'Наименование',
    unit: 'Единица',
    amount: 'Количество',
    sum: 'Сумма'
} as const;

function Results() {

    const {data: materials} = useGetMaterialsQuery();
    const {data: config} = useGetConfigQuery();
    const {data: selectOptions} = useGetSelectOptionsQuery();

    const selectList = materials?.find((el) => el.name === selectOptions?.listValue);
    const selectPipe = materials?.find((el) => el.name === selectOptions?.pipeValue);
    const selectFix = config?.filter(el => el.type === 'fix').find(el => el.key === selectOptions?.choiceOfMaterial);
    console.log("selectList", selectFix);


    return (
        <>
            <div className={styles.resultsSection}>
                <table className={styles.resultTable}>
                    <caption>Часть 2 - Результат</caption>
                    <thead>
                    <tr>
                        <th>{HEADER.name}</th>
                        <th>{HEADER.unit}</th>
                        <th>{HEADER.amount}</th>
                        <th>{HEADER.sum}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{selectOptions?.listValue}</td>
                        <td>{selectList?.unit}</td>
                    </tr>
                    <tr>
                        <td>{selectOptions?.pipeValue}</td>
                        <td>{selectPipe?.unit}</td>

                    </tr>
                    <tr>
                        <td>Саморез</td>
                        <td>{selectFix?.name}</td>
                        <td>{selectFix?.value}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Итого:</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default Results;

//Props
