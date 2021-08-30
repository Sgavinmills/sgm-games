import { useEffect, useState } from 'react';
import { getReviewById, getReviews, patchVotes, getLikedReviews } from '../API-Funcs/API';
import styles from './CSS/Reviews.module.css'
import loading from '../imgs/loading.png'
import Filters from './reviews-sub-components/Filters';
import Pagination from './reviews-sub-components/Pagination';

export default function Reviews({ categories, loggedInUser, likedReviews, setLikedReviews }) {

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

    const changeVotes = (review_id, vote_type, loggedInUser) => {
        const theLikedReview = likedReviews.find(review => review.review_id === review_id);
        if (!theLikedReview) {
            //if its not in the liked review list then stick in in the likedReview list
            const thisReview = reviewsList.find(review => review.review_id === review_id);
            if (thisReview.votes !== 0) { 
                setLikedReviews(currLikedReviews => {
                    const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
                    const newReviewToEdit = { ...thisReview };
                    newReviewToEdit.vote_type = vote_type;
                    newLikedReviews.push(newReviewToEdit);
                    return newLikedReviews;
                })
                setReviewsList(currReviews => {
                    const newReviews = currReviews.map(review => { return { ...review } });
                    const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                    reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes + 1 : reviewToEdit.votes - 1;
                    return newReviews;
                })
            }
        } else {
            //if it is in the liked review list if the vote_Type in the liked review list matches the vote_Type then yoink it from the liked list
            if (theLikedReview.vote_type === vote_type) {
                setLikedReviews(currLikedReviews => {
                    const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
                    const theLikedReviewIndex = newLikedReviews.findIndex(review => review.review_id === review_id);
                    newLikedReviews.splice(theLikedReviewIndex, 1);
                    return newLikedReviews;
                })
                setReviewsList(currReviews => {
                    const newReviews = currReviews.map(review => { return { ...review } });
                    const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                    reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes - 1 : reviewToEdit.votes + 1;
                    return newReviews;
                })
            } else {
                //if vote_types dont match then swap over the types and adjust votes by 2(ie downvoting a previously upvoted post causes a swing of 2 )
                setLikedReviews(currLikedReviews => {
                    const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
                    const theLikedReview = newLikedReviews.find(review => review.review_id === review_id);
                    theLikedReview.vote_type = theLikedReview.vote_type === 'up' ? 'down' : 'up';
                    return newLikedReviews;

                })
                setReviewsList(currReviews => {
                    const newReviews = currReviews.map(review => { return { ...review } });
                    const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                    reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes + 2 : reviewToEdit.votes - 2;
                    return newReviews;
                })
            }
        }
        patchVotes(review_id, vote_type, loggedInUser).catch()
    }


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
                                            <p className={styles['info-text']}>
                                                <span style={{ color: likedReviews.some(review => review.review_id === reviewObj.review_id) && likedReviews.find(review => review.review_id === reviewObj.review_id).vote_type === 'down' ? 'red' : '' }} onClick={() => { changeVotes(reviewObj.review_id, 'down', loggedInUser) }}
                                                    className={styles['votes-thumbs']}><i className="far fa-thumbs-down"> </i> </span>
                                                {reviewObj.votes}
                                                <span style={{ color: likedReviews.some(review => review.review_id === reviewObj.review_id) && likedReviews.find(review => review.review_id === reviewObj.review_id).vote_type === 'up' ? 'blue' : '' }} className={styles['votes-thumbs']} onClick={() => { changeVotes(reviewObj.review_id, 'up', loggedInUser) }}> <i className="far fa-thumbs-up"></i></span>
                                            </p>
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
