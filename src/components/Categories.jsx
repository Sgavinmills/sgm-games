import styles from './CSS/Categories.module.css'
export default function Categories({categories, setCategories}) {
    return (
        <div>
            <div className={styles['categories-container']}>
            { categories.map(category => {
                   return ( <div className={styles['category-window']}>
                        <p className={styles['category-display-header-paragraph']}>{category.slug}</p>
                        <p className={styles['category-display-middle-paragraph']}>12 reviews</p>
                        <p className={styles['category-display-footer-paragraph']}>View all</p>
                    </div> )
            })}
            
            </div>
        </div>
    )
}
