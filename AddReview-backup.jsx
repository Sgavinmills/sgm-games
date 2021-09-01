import { useState, useEffect } from 'react'
import styles from './CSS/AddReview.module.css'
import { postReview } from '../API-Funcs/API';
import Error from './Error';
import { useHistory } from 'react-router';

export default function AddReview({ categories, loggedInUser }) {
    const [postData, setPostData] = useState({
        title: '',
        designer: '',
        owner: loggedInUser.username,
        review_body: '',
        category: '',
        review_img_url: '',
    });
    const [err, setErr] = useState(null);
    const [titleError, setTitleError] = useState(false);
    const [bodyError, setBodyError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    let history = useHistory();

    const returnToHomePage = () => {
        history.push('/reviews');
    }

    if(err) return <Error err={err} setErr={setErr} />
    return (
        <div>
            <section className={styles['form-container']}>
                <header className={styles['form-title-container']}>
                    <p className={styles['form-header-paragraph']}>Post a review</p>
                </header>

                <form className={styles['add-review-form']} onSubmit={(event) => {
                    event.preventDefault();

                    if(postData.title.length > 0 && postData.review_body.length > 0 && categories.some(cat => cat.slug === postData.category)) {
                        setErr(null);
                        postReview(postData).then(() => {
                            returnToHomePage();
                        }).catch(e => {
                            setErr({
                                statusCode : e.response ? e.response.status : '',
                                msg : 'There was a problem, please try again'
                            });
                        })
                        setPostData({
                            title: '',
                            designer: '',
                            owner: loggedInUser.username,
                            review_body: '',
                            category: '',
                            review_img_url: '',
                        })
                } else {
                    if(postData.title.length < 5) {
                        setTitleError(true);
                    } 
                    if(postData.review_body.length < 20 || postData.review_body.length > 2000) {
                        setBodyError(true);
                    }
                    if(!categories.some(cat => cat.slug === postData.category)) {
                        setCategoryError(true);
                    }
                }
                }}>
                    <input value={postData.title} onChange={event => {setPostData(currPostData => {
                        const newPostData = { ...currPostData };
                        newPostData.title = event.target.value;
                        if(newPostData.title.length >= 5) {
                            setTitleError(false);   
                        }
                        return newPostData;
                    }) 
                         }
                        } onBlur={event => {
                        if(postData.title.length < 5) {
                            setTitleError(true);
                        } else setTitleError(false);
                    }} type="text" name="title" placeholder="The title of the game you are going to review..." />
                    { titleError && <p className={styles['error-paragraph']}>Title must contain at least 5 characters</p>}

                    <input value={postData.designer} onChange={event => setPostData(currPostData => {
                        const newPostData = { ...currPostData };
                        newPostData.designer = event.target.value;;
                        return newPostData;
                    })} type="text" name="designer" placeholder="Game designer. Leave blank if you aren't sure :)" />

                    <input value={postData.review_body} onChange={event => { setPostData(currPostData => {
                        const newPostData = { ...currPostData };
                        newPostData.review_body = event.target.value;
                        if(newPostData.review_body.length >= 20 && newPostData.review_body.length < 2000) {
                            setBodyError(false);
                        }
                        return newPostData;
                    })
                }
                } className={styles["review-body"]} onBlur={event => {
                        if(postData.review_body.length < 20 || postData.review_body.length > 2000) {
                            setBodyError(true);
                        } else setBodyError(false);
                    }} type="text" id="title" name="title" placeholder="Review body.... 2000 words max" />
                    { bodyError && <p className={styles['error-paragraph']}>Review must be between 20 and 2000 characters</p>}

                    <input value={postData.review_img_url} onChange={event => setPostData(currPostData => {
                        const newPostData = { ...currPostData };
                        newPostData.review_img_url = event.target.value;
                        return newPostData;
                    })} type="text" id="image_url" name="image_url" placeholder="Image url" />

                    <div className={styles["final-options"]}>
                        <select onChange={(event) => { setPostData(currPostData => {
                            const newPostData = { ...currPostData };
                            newPostData.category = event.target.value;
                            if(categories.some(cat => cat.slug === newPostData.category)) {
                                setCategoryError(false);
                            }
                            return newPostData;
                        })
                        console.log(postData.category);
                     
                    }} onBlur={event => {
                            if(!categories.some(cat => cat.slug === postData.category)) {
                                setCategoryError(true);
                            } else setCategoryError(false);
                        }}> <option value={null}>Category: Pick one</option>
                            {categories.map(category => {
                                return <option value={category.slug} key={category.slug} >{category.slug}</option>
                            })}</select>
                    { categoryError && <p className={styles['error-paragraph']}>Category is a required field</p>}

                    <input type="submit" value="Post review" /> 
                   

                    </div>
                </form>
            </section>
        </div>
    )
}
