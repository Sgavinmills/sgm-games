import { useState, useEffect } from 'react'
import styles from './CSS/AddReview.module.css'
import { postReview } from '../API-Funcs/API';
import Error from './Error';
import { useHistory } from 'react-router';
import { deepCopyObj } from './utils/utils.js'


export default function AddReview({ categories, loggedInUser }) {
    const [postData, setPostData] = useState({
        title: ' ',
        designer: '',
        owner: loggedInUser.username,
        review_body: ' ',
        category: ' ',
        review_img_url: '',
    });

    const [formErrors, setFormErrors] = useState({
        reviewBody: {
            msg: '',
            error: true,
            checkValid: validateBody
        },
        title : {
            msg: '',
            error: true,
            checkValid: validateTitle
        },
        designer: {
            msg: 'Designer must contain some letters or be left blank',
            error: false,
            checkValid: validateDesigner
        },
        category : {
            msg: '',
            error: true,
            checkValid: validateCategory
        },  
        review_img_url : {
            msg: 'Please enter a valid image url, or leave blank to use a default image',
            error: false,
            checkValid: validateImgUrl
        }
    });
    function validateBody(body) {
        setPostData(currPostData => {
            const newPostData = { ...currPostData };
            newPostData.review_body = body;
            return newPostData;
        }) 
        if (body.length < 20 || body.length > 2000) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.reviewBody.error = true;
                newErrors.reviewBody.msg = 'Review body must be between 20-2000 chars'
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.reviewBody.error = false;
            return newErrors;
        })
    }
    function validateTitle(title) {
        setPostData(currPostData => {
            const newPostData = { ...currPostData };
            newPostData.title = title;
            return newPostData;
        }) 
        if (title.length < 5 || title.length > 50) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.title.error = true;
                newErrors.title.msg = 'Title must be between 5-50 chars';
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.title.error = false;
            return newErrors;
        })
    }
    function validateDesigner(designer) {
        setPostData(currPostData => {
            const newPostData = { ...currPostData };
            newPostData.designer = designer;
            return newPostData;
        }) 
        if (designer.length > 0 && !/[a-zA-z]/.test(designer)) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.designer.error = true;
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.designer.error = false;
            return newErrors;
        })
    }
    function validateCategory(category) {
        setPostData(currPostData => {
            const newPostData = { ...currPostData };
            newPostData.category = category;
            return newPostData;
        }) 
        if (!categories.some(cat => cat.slug === category)) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.category.error = true;
                newErrors.category.msg = 'You must choose a category from the list'
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.category.error = false;
            return newErrors;
        })
    }
    function validateImgUrl(imageURL) {
        setPostData(currPostData => {
            const newPostData = { ...currPostData };
            newPostData.review_img_url = imageURL;
            return newPostData;
        }) 
       const isValid = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(imageURL);

        if (imageURL.length > 0 && !isValid) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.review_img_url.error = true;
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.review_img_url.error = false;
            return newErrors;
        })
    }
    function checkFormErrors() {
        validateTitle(postData.title);
        validateCategory(postData.category);
        validateBody(postData.review_body);
        for (const property in formErrors) {
            console.log(formErrors[property].error)
            console.log('hi');
            if (formErrors[property].error === true) {
                console.log('hmm')
                return true;
            }
        }

        return false;
    }
    const [err, setErr] = useState(null);
    let history = useHistory();
    const returnToHomePage = () => {
        history.push('/reviews');
    }
    function submitForm() {
        console.log(postData);
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
                    if(!checkFormErrors()) {
                        submitForm();
                   }
                }}>
                    <input value={postData.title} onChange={event => { validateTitle(event.target.value)  }}  
                    type="text" name="title" placeholder="The title of the game you are going to review..." />
                    { 
                    formErrors.title.error && <p className={styles['error-paragraph']}>{formErrors.title.msg}</p>}

                    <input value={postData.designer} onChange={event => {validateDesigner(event.target.value)}} 
                    type="text" name="designer" placeholder="Game designer. Leave blank if you aren't sure :)" />
                    { formErrors.designer.error && <p className={styles['error-paragraph']}>{formErrors.designer.msg}</p>}

                    <input value={postData.reviewBody} onChange={event => {validateBody(event.target.value)}} 
                    type="text" name="review_body" placeholder="Review body... 2000 words max. Make it fun." className={styles["review-body"]} />
                    { formErrors.reviewBody.error && <p className={styles['error-paragraph']}>{formErrors.reviewBody.msg}</p>}
            
                    <input value={postData.review_img_url} onChange={event => {validateImgUrl(event.target.value)}} 
                    type="text" id="image_url" name="image_url" placeholder="Image url" />
                    { formErrors.review_img_url.error && <p className={styles['error-paragraph']}>{formErrors.review_img_url.msg}</p>}

                    <div className={styles["final-options"]}>
                        <select onChange={(event) => { validateCategory(event.target.value) }}> 
                            <option value={null}>Category: Pick one</option>
                                {categories.map(category => {
                                    return <option value={category.slug} key={category.slug} >{category.slug}</option>
                                })}
                        </select>

                    <input type="submit" value="Post review" /> 
                   

                    </div>
                    { formErrors.category.error && <p className={styles['error-paragraph']}>{formErrors.category.msg}</p>}

                </form>
            </section>
        </div>
    )
}
