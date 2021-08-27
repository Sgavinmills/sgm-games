import styles from './CSS/Header.module.css'


export default function Header() {
    return (
        <div>
            <header className={styles['header-container']}>
                <h1 className={styles['main-header-text']}>SGM Board Game Reviews</h1>
                <h2 className={styles['sub-header-text']}>Bored? Review.</h2>
                <nav className={styles['nav-bar-large-container']}>
                    <ul className={styles['nav-bar-list']}>
                        <li className={styles['nav-list-item']}>Reviews</li>
                        <li className={styles['nav-list-item']}>Categories</li>
                        <li className={styles['nav-list-item']}>Users</li>
                        <li className={styles['nav-list-item']}>Profile</li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}
