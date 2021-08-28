import { useEffect, useState } from 'react';
import { getReviewById, getReviews } from '../API-Funcs/API';
import styles from './CSS/Reviews.module.css'
import loading from '../imgs/loading.png'

export default function Reviews({categories}) {

    const [reviewsList, setReviewsList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showFilterContainer, setShowFilterContainer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getReviews(pageNumber)
            .then(data => {
                setReviewsList(data.reviews);
                setTotalItems(data.total_count);
                 setIsLoading(false);
            })
    }, [pageNumber])



   
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
            
            <div className={styles["filter-button"]} onClick={() => {setShowFilterContainer(curr => !curr)}}>
                <i className="fas fa-filter"></i>
            </div>
            
           {showFilterContainer &&  <div className={styles['filter-container']}>
                <form>
                    <select>
                        <option>Category: none</option>
                        { categories.map(category => {
                            return <option key="categories.slug">{category.slug}</option>
                        })}
                    </select>
                    <select>
                        <option>Sort By: none</option>
                        <option>Owner</option>
                        <option>Title</option>
                        <option>Category</option>
                        <option>Comments</option>
                        <option>Votes</option>
                        <option>Date reviewed - Newest first</option>
                        <option>Date reviewed - Oldest first</option>

                    </select>
                   <select>
                       <option>Reviews from last: All time</option>
                       <option>Reviews from last: 1 minute</option>
                       <option>Reviews from last: 10 minutes</option>
                       <option>Reviews from last: 30 minutes</option>
                       <option>Reviews from last: 1 hour</option>
                       <option>Reviews from last: 6 hours</option>
                       <option>Reviews from last: 12 hours</option>
                       <option>Reviews from last: 24 hours</option>
                       <option>Reviews from last: 3 days</option>
                       <option>Reviews from last: 1 week</option>
                       <option>Reviews from last: 2 week</option>
                       <option>Reviews from last: 1 month</option>
                       <option>Reviews from last: 3 months</option>
                       <option>Reviews from last: 6 months</option>
                       <option>Reviews from last: 1 year</option>
                       <option>Reviews from last: 3 years</option>
                       <option>Reviews from last: 5 years</option>




                   </select>
                </form>
            </div>  }

            <div className={styles['pagination-container']}>
                <p className={styles.pagination}>
                    <span className={styles['pagination-arrow']} onClick={() => { setPageNumber(pg => pg - 1) }}>
                        {pageNumber > 1 && <i className="fas fa-arrow-left"></i>}
                    </span>
                    Page {pageNumber} of {Math.ceil(totalItems / 10)} {/* hardcoder 10 needs to be changed to limit once we have a state for it  */}
                    <span className={styles['pagination-arrow']} onClick={() => { setPageNumber(pg => pg + 1) }}>
                        {pageNumber < Math.ceil(totalItems / 10) && <i className="fas fa-arrow-right"></i>}
                    </span>
                </p>
            </div>
            <form>
                <select>
                    <option>Max results per page: 3</option>
                    <option>Max results per page: 5</option>
                    <option>Max results per page: 10</option>
                    <option>Max results per page: 20</option>
                    <option>Max results per page: 30</option>
                    <option>Max results per page: 50</option>
                </select>
            </form>
        </div>
    )
}
