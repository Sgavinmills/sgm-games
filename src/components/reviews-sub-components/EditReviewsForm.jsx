import React from 'react'
import { patchReview } from '../../API-Funcs/API';
import styles from '../CSS/Reviews.module.css'
import { useState } from 'react';


export default function EditReviewsForm({setErr, setReviewEditError, setEdittingReview, setReviewsList, reviewEditError, reviewObj, newReviewInput, setNewReviewInput, setReview}) {
    return (
            
            <form onSubmit={event => {
                                        event.preventDefault();
                                        if(newReviewInput.length < 20 || newReviewInput.length > 2000) {
                                            setReviewEditError(true);
                                        } else {
                                            //patch review
                                            patchReview(reviewObj.review_id, newReviewInput).catch(e => {
                                                setErr({
                                                    statusCode : e.response.status,
                                                    msg : 'There was a problem, please try again'
                                                });
                                            });
                                            setReviewEditError(false);
                                            setEdittingReview({edittingReview : false, reviewToEdit : ''});
                                            if(setReviewsList) {
                                            setReviewsList(currReviewList => {
                                                const newReviewList = currReviewList.map(review => { return {...review }});
                                                const edittedReview = newReviewList.find(review => review.review_id === reviewObj.review_id);
                                                edittedReview.review_body = newReviewInput;
                                                return newReviewList;
                                            })
                                        } else {
                                            setReview(currReview => {
                                                const newReview = {...currReview};
                                                newReview.review_body = newReviewInput;
                                                return newReview;
                                            })
                                        }
                                            setNewReviewInput('');
                                        }

                                    }}>
                                      <input className={styles['form-edit-body']} type="text" value={newReviewInput} onChange={(event) => setNewReviewInput(event.target.value)}
                                       ></input>
                                     { reviewEditError && <p className={styles['error-paragraph']}>Review must be between 20 and 2000 chars</p>}
                                          <div><br />
                                              <input type="submit" value="Submit review" /> </div>
                                      
            </form>
        
    )
}
