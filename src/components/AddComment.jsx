import { useState } from 'react'
import styles from './CSS/AddReview.module.css'
import { postComment } from '../API-Funcs/API';


export default function AddComment({ loggedInUser, review_id, setCommentsList, setPostingComment }) {
    const [postData, setPostData] = useState({
        username: loggedInUser,
        body: '',
    });

    const [bodyError, setBodyError] = useState(false);

    return (
        <div>
            <section className={styles['form-container']}>
                <header className={styles['form-title-container']}>
                    <p className={styles['form-header-paragraph']}>Add a comment</p>
                </header>

                <form className={styles['add-review-form']} onSubmit={(event) => {
                    event.preventDefault();
                    if(postData.body.length >= 20 && postData.body.length <= 2000) {
                        postComment(postData, review_id)
                            .then(response => {
                                setCommentsList(currComments => {
                                    const newComments = currComments.map(commentObj => { return {...commentObj}})
                                    newComments.push(response.comments);
                                    return newComments;
                                })
                            })
                        setPostData({
                            owner: loggedInUser,
                            body: '',
                        })
                        setPostingComment(false);
                } else {
                    if(postData.body.length < 20 || postData.body.length > 2000) {
                        setBodyError(true);
                    }

                }

                }}>

                    <input value={postData.body} onChange={event => { setPostData(currPostData => {
                        const newPostData = { ...currPostData };
                        newPostData.body = event.target.value;
                        if(newPostData.body.length >= 20 && newPostData.body.length < 2000) {
                            setBodyError(false);
    
                        }
                        return newPostData;
                    })
                   

                }
                } className={styles["review-body"]} onBlur={event => {
                        if(postData.body.length < 20 || postData.body.length > 2000) {
                            setBodyError(true);
                        } else setBodyError(false);
                    }} type="text" id="title" name="title" placeholder="Enter comment here.... 2000 words max" />
                    { bodyError && <p className={styles['error-paragraph']}>Comment must be between 20 and 2000 characters</p>}


                    <div className={styles["final-options"]}>
                       
                        <input type="submit" value="Post comment" /> 
                   

                    </div>
                </form>
            </section>
        </div>
    )
}
