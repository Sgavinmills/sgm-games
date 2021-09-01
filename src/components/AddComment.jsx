import { useState } from 'react'
import styles from './CSS/AddReview.module.css'
import { postComment } from '../API-Funcs/API';
import Error from './Error';
import { deepCopyObj } from './utils/utils.js'


export default function AddComment({ setTotalItems, loggedInUser, review_id, setCommentsList, setPostingComment }) {
    const [postData, setPostData] = useState({
        username: loggedInUser.username,
        body: '',
    });
    const [err, setErr] = useState(null);

    const [formErrors, setFormErrors] = useState({
        commentBody: {
            msg: ' ',
            error: true,
            checkValid: validateBody
        }
    });
    function validateBody(body) {
        if (body.length < 20 || body.length > 2000) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.commentBody.error = true;
                newErrors.commentBody.msg = 'Comment body must be between 20-2000 chars'
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.commentBody.error = false;
            return newErrors;
        })
    }

    function checkFormErrors() {
        validateBody(postData.body);
        for (const property in formErrors) {
            if (formErrors[property].error) {
                return true;
            }
        }
        return false;
    }

    function submitForm() {
        setErr(null);
        postComment(postData, review_id)
            .then(response => {
                setCommentsList(currComments => {
                    const newComments = currComments.map(commentObj => { return { ...commentObj } })
                    newComments.push(response.comments);
                    return newComments;
                })
            }).catch(e => {
                setErr({
                    statusCode: e.response.status,
                    msg: 'There was a problem, please try again'
                });
            })
        setPostData({
            owner: loggedInUser.username,
            body: '',
        })
        setPostingComment(false);
        setTotalItems(currCount => currCount + 1)
    }


    if (err) return <Error err={err} setErr={setErr} />

    return (
        <div>
            <section className={styles['form-container']}>
                <header className={styles['form-title-container']}>
                    <p className={styles['form-header-paragraph']}>Add a comment</p>
                </header>

                <form className={styles['add-review-form']} onSubmit={(event) => {
                    event.preventDefault();
                    if (!checkFormErrors()) {
                        submitForm();
                    }
                }}>

                    <input value={postData.body} onChange={event => {
                        formErrors.commentBody.checkValid(event.target.value);
                        setPostData(currPostData => {
                            const newPostData = { ...currPostData };
                            newPostData.body = event.target.value;
                            return newPostData;
                        })
                    }} className={styles["review-body"]} type="text" id="title" name="title" placeholder="Enter comment here.... 2000 words max" />
                    {formErrors.commentBody.error && <p className={styles['error-paragraph']}>{formErrors.commentBody.msg}</p>}


                    <div className={styles["final-options"]}>
                        <input type="submit" value="Post comment" />
                    </div>
                </form>
            </section>
        </div>
    )
}
