import styles from './CSS/Loading.module.css'

export default function Loading() {
    return (
        <div>
            <div className={styles["loading-circle"]}></div>
        </div>
    )
}
