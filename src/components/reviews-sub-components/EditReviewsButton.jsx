import React from 'react'
import styles from '../CSS/Reviews.module.css'

export default function EditReviewsButton({setEdittingReview, setNewReviewInput, setReviewEditError, reviewObj, review}) {
    return (
        
            <span className={styles['edit-button']} onClick={() => { setEdittingReview(currObj => {
                console.log('hi');
                                     const newEditObj = {...currObj};
                                     newEditObj.edittingReview = !newEditObj.edittingReview;
                                     newEditObj.reviewToEdit = reviewObj.review_id;
                                     return newEditObj;
                                 })
                                setNewReviewInput(reviewObj.review_body);
                                setReviewEditError(false);

                                }}><i class="far fa-edit"></i>
            </span> 
        
    )
}
