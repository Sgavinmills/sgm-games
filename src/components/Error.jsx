import { Link } from 'react-router-dom'
import styles from './CSS/Error.module.css'

export default function Error({err, setErr}) {
    return (
        <div>
            {/* <h1>{err.statusCode} {err.msg}</h1> */}
            <div className={styles['error-container']}>
                
                    <h1>{err.statusCode}</h1>
                    <h2>{err.msg}</h2>
                    <Link to="/reviews"> <button onClick={() => { setErr(null)}}>Main Page</button></Link>
            </div>
        </div>
    )
}
