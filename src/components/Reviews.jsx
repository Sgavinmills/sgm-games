import { useEffect, useState } from 'react';
import { getReviewById, getReviews } from '../API-Funcs/API';
import styles from './CSS/Reviews.module.css'
import loading from '../imgs/loading.png'

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
    const [showFilterContainer, setShowFilterContainer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        console.log('filters changed, calling reviews')
        getReviews(filters)
            .then(data => {
                console.log(data.reviews);
                setReviewsList(data.reviews);
                setTotalItems(data.total_count);
                setIsLoading(false);
            })
    }, [filters])

console.log(filters);


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

            <div className={styles["filter-button"]} onClick={() => { setShowFilterContainer(curr => !curr) }}>
                <i className="fas fa-filter"></i>
            </div>

            {showFilterContainer && <div className={styles['filter-container']}>
                <form>
                    <select onChange={event => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            newFilter.category = categories.some(cat => cat.slug === event.target.value) ? event.target.value : null;
                            return newFilter;
                        })
                    }}>
                        <option value={null}>Category: none</option>
                        {categories.map(category => {
                            return <option value={category.slug} key={category.slug} >{category.slug}</option>
                        })}
                    </select>
                    <select onChange={event => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            switch (event.target.value) {
                                case 'none':
                                    newFilter.sort_by = null;
                                    newFilter.order = null;
                                    break;
                                case 'owner-a-z':
                                    newFilter.sort_by = 'owner';
                                    newFilter.order = 'asc';
                                    break;
                                case 'owner-z-a':
                                    newFilter.sort_by = 'owner';
                                    newFilter.order = 'desc';
                                    break;
                                case 'title-a-z':
                                    newFilter.sort_by = 'title';
                                    newFilter.order = 'asc';
                                    break;
                                case 'title-z-a':
                                    newFilter.sort_by = 'title';
                                    newFilter.order = 'desc';
                                    break;
                                case 'category':
                                    newFilter.sort_by = 'category';
                                    newFilter.order = 'asc';
                                    break;
                                case 'comments-high':
                                    newFilter.sort_by = 'comment_count';
                                    newFilter.order = 'desc';
                                    break;
                                case 'comments-low':
                                    newFilter.sort_by = 'comment_count';
                                    newFilter.order = 'asc';
                                    break;
                                case 'votes-low':
                                    newFilter.sort_by = 'votes';
                                    newFilter.order = 'asc';
                                    break;
                                case 'votes-high':
                                    newFilter.sort_by = 'votes';
                                    newFilter.order = 'desc';
                                    break;
                                case 'date-new':
                                    newFilter.sort_by = 'created_at';
                                    newFilter.order = 'desc';
                                    break;
                                case 'date-old':
                                    newFilter.sort_by = 'created_at';
                                    newFilter.order = 'asc';
                                    break;
                            }
                            newFilter.p = 1;
                            return newFilter;
                        })
                    }}>
                        <option value="none">Sort By: none</option>
                        <option value='owner-a-z'>Reviewed by (A-Z)</option>
                        <option value='owner-z-a'>Reviewed by (Z-A) </option>
                        <option value="title-a-z">Title (A-Z)</option>
                        <option value="title-z-a">Title (Z-A)</option>
                        <option value="category">Category</option>
                        <option value="comments-high">Comments (high - low)</option>
                        <option value="comments-low">Comments (low - high)</option>
                        <option value="votes-high">Votes (high - low)</option>
                        <option value="votes-low">Votes (low- high)</option>
                        <option value="date-new">Date reviewed - Newest first</option>
                        <option value="date-old">Date reviewed - Oldest first</option>

                    </select>
                    <select onChange={event => setFilters(currFilters => {
                        const newFilters = { ...currFilters };
                        const tmpArr = event.target.value.split(' ');
                        newFilters[tmpArr[1]] = tmpArr[0];
                        if (tmpArr[1] === 'minutes') {
                            newFilters.hours = null;
                            newFilters.days = null;
                            newFilters.weeks = null;
                            newFilters.months = null;

                        } else if (tmpArr[1] === 'hours') {
                            newFilters.minutes = null;
                            newFilters.days = null;
                            newFilters.weeks = null;
                            newFilters.months = null;

                        } else if (tmpArr[1] === 'days') {
                            newFilters.minutes = null;

                            newFilters.hours = null;
                            newFilters.weeks = null;
                            newFilters.months = null;

                        } if (tmpArr[1] === 'weeks') {
                            newFilters.minutes = null;

                            newFilters.hours = null;
                            newFilters.days = null;
                            newFilters.months = null;

                        } if (tmpArr[1] === 'months') {
                            newFilters.minutes = null;

                            newFilters.hours = null;
                            newFilters.days = null;
                            newFilters.weeks = null;

                        }
                        console.log(newFilters);
                        return newFilters;
                    })}>
                        <option>Reviews from last: All time</option>
                        <option value="1 minutes">Reviews from last: 1 minute</option>
                        <option value="10 minutes">Reviews from last: 10 minutes</option>
                        <option value="30 minutes">Reviews from last: 30 minutes</option>
                        <option value="1 hours">Reviews from last: 1 hour</option>
                        <option value="6 hours">Reviews from last: 6 hours</option>
                        <option value="12 hours">Reviews from last: 12 hours</option>
                        <option value="24 hours">Reviews from last: 24 hours</option>
                        <option value="3 days">Reviews from last: 3 days</option>
                        <option value="1 weeks">Reviews from last: 1 week</option>
                        <option value="2 weeks">Reviews from last: 2 week</option>
                        <option value="1 months">Reviews from last: 1 month</option>
                        <option value="3 months">Reviews from last: 3 months</option>
                        <option value="6 months">Reviews from last: 6 months</option>
                        <option value="12 months">Reviews from last: 1 year</option>
                        <option value="36 months">Reviews from last: 3 years</option>
                        <option value="60 months">Reviews from last: 5 years</option>
                    </select>
                </form>
            </div>}

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
                    {/* hardcoded 10 needs to be changed to limit once we have a state for it  */}
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
                    return newFilter;
                })
            }}>
                <select defaultValue={filters.limit}>
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
