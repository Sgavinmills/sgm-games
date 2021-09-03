import styles from './CSS/Header.module.css'
import { Link } from 'react-router-dom'


export default function Header({loggedInUser}) {
    return (
        <div>
            <header className={styles['header-container']}>
                <div className={styles['logged-in-box']}><p className={styles['logged-in-paragraph']}>You are logged in as '{loggedInUser.username}' for demo purposes</p></div>
                <h1 className={styles['main-header-text']}>SGM Board Game Reviews</h1>
                <h2 className={styles['sub-header-text']}>Bored? Review.</h2>
                <nav className={styles['nav-bar-large-container']}>
                    <ul className={styles['nav-bar-list']}>
                    <Link className={styles.link} to="/reviews"><li>Reviews</li></Link>
                    <Link className={styles.link} to="/categories"><li>Categories</li></Link>
                    <Link className={styles.link} to="/users"><li>Users</li></Link>
                    <Link className={styles.link} to="/profile"> <li>Profile</li></Link>
                    </ul>
                </nav>
            </header>
        </div>
    )
}
