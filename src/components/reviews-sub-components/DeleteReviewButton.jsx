import React from 'react'
import styles from '../CSS/Reviews.module.css'
import { deleteReview } from '../../API-Funcs/API';

export default function DeleteReviewButton({reviewObj, setReviewsList, setErr}) {
    return (
        
        <span onClick={() => {
            if (window.confirm('Are you sure you wish to delete this item? This action cannot be undone')) {
                deleteReview(reviewObj.review_id).catch(e => {
                    setErr({
                        statusCode : e.response ? e.response.status : '',
                        msg : 'There was a problem deleting your message, please try again'
                    });
                })
                setReviewsList(currReviews => {
                    const newReviews = currReviews.map(review => { return { ...review } });
                    const deletedIndex = newReviews.findIndex(review => review.review_id === reviewObj.review_id);
                    newReviews.splice(deletedIndex, 1);
                    return newReviews;
                })
            }
        }} className={styles['delete-button']}>  <i className="far fa-trash-alt"></i> </span>
        
    )
}
