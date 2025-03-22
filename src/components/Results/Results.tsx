import styles from './Results.module.css';

const HEADER = {
    name:'Наименование',
    unit: 'Единица',
    amount: 'Количество',
    sum: 'Сумма'
} as const;

function Results() {
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
                        <td>Лист-12 0.5 ширина 1м</td>
                    </tr>
                    <tr>
                        <td>Труба 20х20</td>

                    </tr>
                    <tr>
                        <td>Саморез</td>

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