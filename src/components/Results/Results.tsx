import styles from './Results.module.css';

function Results() {
    return (
        <>
            <div className={styles.resultsSection}>
                <table className={styles.resultTable}>
                    <caption>Часть 2 - Результат</caption>
                    <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Единица</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Лист-12 0.5 ширина 1м</td>
                        <td>м²</td>
                        <td>10</td>
                        <td>220</td>
                    </tr>
                    <tr>
                        <td>Труба 20х20</td>
                        <td>мп</td>
                        <td>50</td>
                        <td>900</td>
                    </tr>
                    <tr>
                        <td>Саморез</td>
                        <td>шт</td>
                        <td>60</td>
                        <td>66</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Итого:</td>
                        <td>1186</td>
                    </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default Results;