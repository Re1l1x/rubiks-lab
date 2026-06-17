import styles from "../about.module.css";

export const metadata = {
    title: "О разработчиках",
};

const Developers = () => {
    return (
        <div className={styles.page}>
            <div className={`${styles.content} ${styles.centered}`}>
                <h1 className={styles.title}>О разработчиках</h1>
                <div className={styles.body}>
                    <p>Самарский университет</p>
                    <p>Институт информатики и кибернетики</p>
                    <p>
                        Курсовой проект по дисциплине «Программная инженерия» по теме
                        «Приложение «Игра «Кубик Рубика»
                    </p>
                    <p>Разработчики (обучающиеся группы 6301-020302D):</p>
                    <ul>
                        <li>Фадеев А.М.</li>
                        <li>Дьячков Д.С.</li>
                    </ul>
                    <p>2026 г.</p>
                </div>
            </div>
        </div>
    );
};

export default Developers;
