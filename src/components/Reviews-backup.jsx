import { useEffect, useState } from 'react';
import { patchReview, getReviewById, getReviews, patchVotes, getLikedReviews, deleteReview } from '../API-Funcs/API';
import styles from './CSS/Reviews.module.css'
import Filters from './reviews-sub-components/Filters';
import Pagination from './reviews-sub-components/Pagination';
import { Link } from 'react-router-dom'
import Loading from './Loading';
import EditReviewsButton from './reviews-sub-components/EditReviewsButton';
import EditReviewsForm from './reviews-sub-components/EditReviewsForm';


export default function Reviews({ isLoading, setIsLoading, categories, loggedInUser, likedReviews, setLikedReviews, newReviewInput, setNewReviewInput, reviewEditError, setReviewEditError, edittingReview, setEdittingReview  }) {

    const [reviewsList, setReviewsList] = useState([]);

    // moving these 3 up to app.js REVERSE IF NECC
    // const [newReviewInput, setNewReviewInput] = useState('');
    // const [reviewEditError, setReviewEditError] = useState([false]);
    // const [edittingReview, setEdittingReview] = useState({edittingReview : false, reviewToEdit : ''});
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

    useEffect(() => {
        setIsLoading(true);
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
        const thisReview = reviewsList.find(review => review.review_id === review_id);
        if ((thisReview.votes === 0 && vote_type === 'down') || (theLikedReview && vote_type === 'down' && thisReview.votes === 1)) { } else {
            if (!theLikedReview) {
                //if its not in the liked review list then stick in in the likedReview list
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
    }

    if (isLoading) return <Loading />
    
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
                                            <Link className={styles.link} to={`/review/${reviewObj.review_id}`}>  <p className={styles['info-header']}>Comments</p></Link>
                                            <p className={styles['info-text']}>{reviewObj.comment_count}</p>
                                        </li>

                                    </ul>
                                </div>
                                <div className={styles['main-review-box']}>
                                    <img className={styles['review-image']} alt="review" src={reviewObj.review_img_url} />

                                    <div className={styles['review-text']}>
                                        <h3>{reviewObj.title}</h3>
                                        {/* //edit review form code */}
                                       { edittingReview.edittingReview && edittingReview.reviewToEdit === reviewObj.review_id ?
                                       
                                       <EditReviewsForm newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} reviewEditError={reviewEditError} reviewObj={reviewObj} setReviewEditError={setReviewEditError} setEdittingReview={setEdittingReview} setReviewsList={setReviewsList} />
                                    //    <form onSubmit={event => {
                                    //     event.preventDefault();
                                    //     if(newReviewInput.length < 20 || newReviewInput.length > 2000) {
                                    //         setReviewEditError(true);
                                    //     } else {
                                    //         //patch review
                                    //         patchReview(reviewObj.review_id, newReviewInput);
                                    //         setReviewEditError(false);
                                    //         setEdittingReview({edittingReview : false, reviewToEdit : ''});
                                    //         setReviewsList(currReviewList => {
                                    //             const newReviewList = currReviewList.map(review => { return {...review }});
                                    //             const edittedReview = newReviewList.find(review => review.review_id === reviewObj.review_id);
                                    //             edittedReview.review_body = newReviewInput;
                                    //             return newReviewList;
                                    //         })
                                    //         setNewReviewInput('');

                                    //     }

                                    // }}>
                                    //   <input className={styles['form-edit-body']} type="text" value={newReviewInput} onChange={(event) => setNewReviewInput(event.target.value)}
                                    //    ></input>
                                    //  { reviewEditError && <p className={styles['error-paragraph']}>Review must be between 20 and 2000 chars</p>}
                                    //       <div><br />
                                    //           <input type="submit" value="Submit review" /> </div>
                                      
                                    //   </form> 
                                      : <p className={styles['review-body-paragraph l4']}>{reviewObj.review_body}</p> 
                                      
                                      
                                       } 
                                       {/* end of edit review  */}
                                    </div>
                                </div>

                                {/* edit and delete buttons */}
                                {reviewObj.owner === loggedInUser && <>
                                
                                <EditReviewsButton reviewObj={reviewObj} setEdittingReview={setEdittingReview} setNewReviewInput={setNewReviewInput} setReviewEditError={setReviewEditError}/>
                                 {/* <span className={styles['edit-button']} onClick={() => { setEdittingReview(currObj => {
                                     const newEditObj = {...currObj};
                                     newEditObj.edittingReview = !newEditObj.edittingReview;
                                     newEditObj.reviewToEdit = reviewObj.review_id;
                                     return newEditObj;
                                 })
                                setNewReviewInput(reviewObj.review_body);
                                setReviewEditError(false);

                                }}><i class="far fa-edit"></i></span>  */}
                               
                                <span onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this item? This action cannot be undone')) {
                                        deleteReview(reviewObj.review_id);
                                        setReviewsList(currReviews => {
                                            const newReviews = currReviews.map(review => { return { ...review } });
                                            const deletedIndex = newReviews.findIndex(review => review.review_id === reviewObj.review_id);
                                            newReviews.splice(deletedIndex, 1);
                                            return newReviews;
                                        })
                                    }
                                }} className={styles['delete-button']}>  <i class="far fa-trash-alt"></i> </span></>}

                            </div>
                        )
                    })

                }

            </div>
            <div className={styles["create-and-top-buttons-container"]}>
                <Link className={styles.link} to="/addreview"> <span className={styles["add-review-button"]}><i class="fas fa-plus create-and-top-buttons"></i></span></Link>
            </div>
            <Filters categories={categories} setFilters={setFilters} />
            <Pagination setFilters={setFilters} totalItems={totalItems} filters={filters} />
        </div>
    )
}
