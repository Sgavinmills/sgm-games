import { Link } from 'react-router-dom'
import styles from './CSS/Error.module.css'

export default function Error({err, setErr}) {
    return (
        <div>
            <div className={styles['error-container']}>
                    <h1>{err.statusCode}</h1>
                    <h2>{err.msg}</h2>
                    <Link to="/categories"> <button onClick={() => { setErr(null)}}>Categories Page</button></Link>
            </div>
        </div>
    )
}
