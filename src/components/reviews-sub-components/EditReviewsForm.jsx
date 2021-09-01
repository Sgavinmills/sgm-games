import React from 'react'
import { patchReview } from '../../API-Funcs/API';
import styles from '../CSS/Reviews.module.css'
import { useState } from 'react';
import { deepCopyObj } from '../utils/utils.js'

export default function EditReviewsForm({ setErr, setEdittingReview, setReviewsList, reviewObj, newReviewInput, setNewReviewInput, setReview }) {

    const [formErrors, setFormErrors] = useState({
        reviewBody: {
            msg: 'Review body must be between 20-2000 chars',
            error: false,
            checkValid: validateBody
        }
    });

  

    function validateBody(body) {
        if (body.length < 20 || body.length > 2000) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.reviewBody.error = true;
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.reviewBody.error = false;
            return newErrors;
        })
    }

    function checkFormErrors() {
        for (const property in formErrors) {
            if (formErrors[property].error) {
                return true;
            }
        }
        return false;
    }

    function submitForm() {
        patchReview(reviewObj.review_id, newReviewInput).catch(e => {
            setErr({
                statusCode: e.response.status,
                msg: 'There was a problem, please try again'
            });
        });
        setEdittingReview({ edittingReview: false, reviewToEdit: '' });
        if (setReviewsList) {
            setReviewsList(currReviewList => {
                const newReviewList = currReviewList.map(review => { return { ...review } });
                const edittedReview = newReviewList.find(review => review.review_id === reviewObj.review_id);
                edittedReview.review_body = newReviewInput;
                return newReviewList;
            })
        } else {
            setReview(currReview => {
                const newReview = { ...currReview };
                newReview.review_body = newReviewInput;
                return newReview;
            })
        }
        setNewReviewInput('');


    }

    return (
        <form onSubmit={event => {
            event.preventDefault();
            if (!checkFormErrors()) {
               submitForm();
            }
        }}>
            <input className={styles['form-edit-body']} type="text" value={newReviewInput} onChange={(event) => {
                formErrors.reviewBody.checkValid(event.target.value);
                setNewReviewInput(event.target.value)
            }
            }
            ></input>
            {formErrors.reviewBody.error && <p className={styles['error-paragraph']}>Review must be between 20 and 2000 chars</p>}
            <div><br />
                <input type="submit" value="Submit review" /> </div>

        </form>

    )
}
