import styles from './CSS-sub-component/Pagination.module.css'

export default function Pagination({setFilters, filters, totalItems}) {
    return (
        <div>
            
            <div className={styles['pagination-container']}>
                <p className={styles.pagination}>
                    <span className={styles['pagination-arrow']} onClick={() => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            newFilter.p = currFilter.p - 1;
                            return newFilter;
                        })
                    }}>
                        {filters.p > 1 && <i className="fas fa-arrow-left"></i>}
                    </span>
                    Page {filters.p} of {Math.ceil(totalItems / filters.limit)}
                    <span className={styles['pagination-arrow']} onClick={() => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            newFilter.p = currFilter.p + 1;
                            return newFilter;
                        })
                    }}>
                        {filters.p < Math.ceil(totalItems / filters.limit) && <i className="fas fa-arrow-right"></i>}
                    </span>
                </p>
            </div>
            <form onChange={(event) => {
                setFilters(currFilter => {
                    const newFilter = { ...currFilter };
                    newFilter.limit = event.target.value;
                    newFilter.p = 1;
                    return newFilter;
                })
            }}>
                <select defaultValue={filters.limit}>
                    <option value={filters.limit} >Max results per page: {filters.limit}</option>
                    {totalItems >= 3 && <option value={3} >Max results per page: 3</option>}
                    {totalItems >= 5 && <option value={5}>Max results per page: 5</option>}
                    {totalItems >= 10 && <option value={10}>Max results per page: 10</option>}
                    {totalItems >= 20 && <option value={20}>Max results per page: 20</option>}
                    {totalItems >= 30 && <option value={30}>Max results per page: 30</option>}
                    {totalItems >= 50 && <option value={50}>Max results per page: 50</option>}
                </select>
            </form>
        </div>
    )
}
