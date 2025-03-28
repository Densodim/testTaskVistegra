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
    const selectFrame = config?.filter(el => el.type === 'frame').find(el => el.key === selectOptions?.choiceOfFrame);

    const length = config?.find(el => el.key === 'length')?.value || 0;
    const width = config?.find(el => el.key === 'width')?.value || 0;

    // Количество листов
    const sheetArea = length * width;
    const sheetWidth = selectList?.width as number;
    const sheetsRequired = Math.ceil(sheetArea / sheetWidth);
    const sheetsRequiredCount = sheetsRequired * (selectList?.price as number);

    // Количество трубы в метрах
    const pipeWidthMeters = (selectPipe?.width as number) / 1000;
    const step = selectFrame?.step as number;
    const horizontalPipes = Math.ceil(length / step) + 1;
    const verticalPipes = Math.ceil(width / step) + 1;
    const totalPipes = (horizontalPipes * width) + (verticalPipes * length);
    const totalPipeLength = Math.round(totalPipes * pipeWidthMeters);
    const totalPipeLengthCount = totalPipeLength * (selectPipe?.price as number);

    // Количество саморезов
    const screwsPerSquareMeter = selectFix?.value as number;
    const totalScrews = Math.ceil(sheetArea * screwsPerSquareMeter);

    // Расчетный размер ячейки
    const cellSize = `${(length / horizontalPipes).toFixed(2)}x${(width / verticalPipes).toFixed(2)}м`;

    // Total
    const Total = sheetsRequiredCount * totalPipeLengthCount

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
                        <td>{sheetsRequired}</td>
                        <td>{sheetsRequiredCount}</td>
                    </tr>
                    <tr>
                        <td>{selectOptions?.pipeValue}</td>
                        <td>{selectPipe?.unit}</td>
                        <td>{totalPipeLength}</td>
                        <td>{totalPipeLengthCount}</td>

                    </tr>
                    <tr>
                        <td>Саморез</td>
                        <td>{selectFix?.name} - {selectFix?.value}</td>
                        <td>{totalScrews}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Итого:</td>
                        <td>{Total}</td>
                    </tr>
                    <tr>
                        <td>Площадь изделия</td>
                        <td>{`${sheetArea.toFixed(2)} м2`}</td>
                    </tr>
                    <tr>
                        <td>Расчетный размер ячейки</td>
                        <td>{cellSize}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default Results;

//Props
