import { useEffect, useState } from 'react';
import { getReviewById, getReviews } from '../API-Funcs/API';
import styles from './CSS/Reviews.module.css'
import loading from '../imgs/loading.png'
import Filters from './reviews-sub-components/Filters';
import Pagination from './reviews-sub-components/Pagination';

export default function Reviews({ categories }) {

    const [reviewsList, setReviewsList] = useState([]);
    const [filters, setFilters] = useState({
        p: 1,
        sort_by: null,
        limit: 10,
        category: null,
        minutes: null,
        hours: null,
        days: null,
        months: null
    });
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getReviews(filters)
            .then(data => {
                console.log(data.reviews);
                setReviewsList(data.reviews);
                setTotalItems(data.total_count);
                setIsLoading(false);
            })
    }, [filters])



    if (isLoading) return <img src={loading}></img>
    return (
        <div>
            <div className={styles['reviews-container']}>
                {
                    reviewsList.map((reviewObj) => {
                        return (
                            <div key={reviewObj.review_id} className={styles['review-box']}>
                                <div className={styles['review-box-info-bar']}>
                                    <ul className={styles['review-box-info-bar-list']}>
                                        <li className={styles['review-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Reviewed By</p>
                                            <p className={styles['info-text']}><a href='#'>{reviewObj.owner}</a></p>
                                        </li>
                                        <li className={styles['review-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Category</p>
                                            <p className={styles['info-text']}><a href='#'>{reviewObj.category}</a></p>
                                        </li>
                                        <li className={styles['review-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Date posted</p>
                                            <p className={styles['info-text']}>{reviewObj.created_at}</p>
                                        </li>
                                        <li className={styles['review-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Votes</p>
                                            <p className={styles['info-text']}>{reviewObj.votes}</p>
                                        </li>
                                        <li className={styles['review-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Comments</p>
                                            <p className={styles['info-text']}>{reviewObj.comment_count}</p>
                                        </li>

                                    </ul>
                                </div>
                                <div className={styles['main-review-box']}>
                                    <img className={styles['review-image']} alt="review" src="https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                                    <div className={styles['review-text']}>
                                        <h3>{reviewObj.title}</h3>
                                        <p className={styles['review-body-paragraph l4']}>{reviewObj.review_body}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }

            </div>
            <Filters categories={categories} setFilters={setFilters} />
            <Pagination setFilters={setFilters} totalItems={totalItems} filters={filters} />
        </div>
    )
}
