import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { patchVotes, getReviewById, getCommentsByReviewId, deleteReview, getLikedComments, deleteComment, patchCommentVotes } from "../API-Funcs/API";
import styles from './CSS/Reviews.module.css'
import { Redirect } from "react-router";
import AddComment from './AddComment.jsx'
import Loading from './Loading';

import Error from './Error';
import EditReviewsButton from "./reviews-sub-components/EditReviewsButton";
import EditReviewsForm from './reviews-sub-components/EditReviewsForm';
import EditCommentsButton from "./reviews-sub-components/EditCommentsButton";
import EditCommentsForm from "./reviews-sub-components/EditCommentsForm";
import ReviewsVotes from "./reviews-sub-components/ReviewsVotes";
import CommentsVotes from "./reviews-sub-components/CommentsVotes";
import Pagination from "./reviews-sub-components/Pagination";





export default function SingleReview({ likedReviews, setLikedReviews, loggedInUser, isLoading, setIsLoading, setEdittingReview, setNewReviewInput, setReviewEditError, newReviewInput, reviewEditError, edittingReview, setNewCommentInput, newCommentInput, commentEditError, setCommentEditError, edittingComment, setEdittingComment }) {
    const [review, setReview] = useState({});
    const [commentsList, setCommentsList] = useState([]);
    const { review_id } = useParams();
    const [err, setErr] = useState(null);
    const [likedComments, setLikedComments] = useState([]);
    const [postingComment, setPostingComment] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(true);

    const [filters, setFilters] = useState({
        p: 1,
        limit: 10,
    });

    const [totalItems, setTotalItems] = useState(0);


    useEffect(() => {
        setIsLoadingComments(true);
        setIsLoading(true);
        setErr(null);
        getReviewById(review_id)
            .then((response) => {
                console.log('worked')
                setReview(response.reviews);
                setIsLoading(false);
            }).catch((e) => {
                setErr({
                    statusCode: 404,
                    msg: 'Review not found'
                });
            })
        getCommentsByReviewId(review_id, filters)
            .then((response) => {
                setCommentsList(response.comments);
                setIsLoadingComments(false);
                setTotalItems(response.total_count);
            }).catch((e) => {
                setErr({
                    statusCode: e.response.status,
                    msg: 'Review not found'
                });
            })
    }, [review_id, filters])


    useEffect(() => {
        getLikedComments(loggedInUser.username)
            .then(data => {
                setLikedComments(data.comments);
            })
    }, [loggedInUser])

    useEffect(() => {
        //update total count
        //want to do it when comment list updates, but that will be a problem for a re-render. 
    })



    // const changeVotes = (review_id, vote_type, loggedInUser) => {
    //     const theLikedReview = likedReviews.find(review => review.review_id === review_id);
    //     const thisReview = review;
    //     if((thisReview.votes === 0 && vote_type === 'down') || (theLikedReview && vote_type === 'down' && thisReview.votes === 1)) {} else {
    //     if (!theLikedReview) {
    //         //if its not in the liked review list then stick in in the likedReview list
    //             setLikedReviews(currLikedReviews => {
    //                 const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
    //                 const newReviewToEdit = { ...thisReview };
    //                 newReviewToEdit.vote_type = vote_type;
    //                 newLikedReviews.push(newReviewToEdit);
    //                 return newLikedReviews;
    //             })
    //             setReview(currReview => {
    //                 const newReview = {...currReview};
    //                 newReview.votes = vote_type === 'up' ? newReview.votes + 1 : newReview.votes - 1;
    //                 return newReview;
    //             })

    //     } else {
    //         //if it is in the liked review list if the vote_Type in the liked review list matches the vote_Type then yoink it from the liked list
    //         if (theLikedReview.vote_type === vote_type) {
    //             setLikedReviews(currLikedReviews => {
    //                 const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
    //                 const theLikedReviewIndex = newLikedReviews.findIndex(review => review.review_id === review_id);
    //                 newLikedReviews.splice(theLikedReviewIndex, 1);
    //                 return newLikedReviews;
    //             })
    //             setReview(currReview => {
    //                 const newReview = {...currReview}
    //                 newReview.votes = vote_type === 'up' ? newReview.votes - 1 : newReview.votes + 1;
    //                 return newReview;
    //             })
    //         } else {
    //             //if vote_types dont match then swap over the types and adjust votes by 2(ie downvoting a previously upvoted post causes a swing of 2 )
    //             setLikedReviews(currLikedReviews => {
    //                 const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
    //                 const theLikedReview = newLikedReviews.find(review => review.review_id === review_id);
    //                 theLikedReview.vote_type = theLikedReview.vote_type === 'up' ? 'down' : 'up';
    //                 return newLikedReviews;

    //             })
    //             setReview(currReview => {
    //                 const newReview = {...currReview}
    //                 newReview.votes = vote_type === 'up' ? newReview.votes + 2 : newReview.votes - 2;
    //                 return newReview;
    //             })
    //         }
    //     }
    //     patchVotes(review_id, vote_type, loggedInUser).catch()

    // }
    // }

    // const changeCommentVotes = (comment_id, vote_type, loggedInUser) => {
    //     const theLikedComment = likedComments.find(comment => comment.comment_id === comment_id);
    //     const thisComment = commentsList.find(comment => comment.comment_id === comment_id);
    //     if((thisComment.votes === 0 && vote_type === 'down') || (theLikedComment && vote_type === 'down' && thisComment.votes === 1)) {} else {
    //     if (!theLikedComment) {
    //         //if its not in the liked review list then stick in in the likedReview list
    //             setLikedComments(currLikedComments => {
    //                 const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
    //                 const newCommentToEdit = { ...thisComment };
    //                 newCommentToEdit.vote_type = vote_type;
    //                 newLikedComments.push(newCommentToEdit);
    //                 return newLikedComments;
    //             })
    //             setCommentsList(currComments => {
    //                 const newComments = currComments.map(comment => { return { ...comment } });
    //                 const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
    //                 commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes + 1 : commentToEdit.votes - 1;
    //                 return newComments;
    //             })

    //     } else {
    //         //if it is in the liked review list if the vote_Type in the liked review list matches the vote_Type then yoink it from the liked list
    //         if (theLikedComment.vote_type === vote_type) {
    //             setLikedComments(currLikedComments => {
    //                 const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
    //                 const theLikedCommentIndex = newLikedComments.findIndex(comment => comment.comment_id === comment_id);
    //                 newLikedComments.splice(theLikedCommentIndex, 1);
    //                 return newLikedComments;
    //             })
    //             setCommentsList(currComments => {
    //                 const newComments = currComments.map(comment => { return { ...comment } });
    //                 const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
    //                 commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes - 1 : commentToEdit.votes + 1;
    //                 return newComments;
    //             })
    //         } else {
    //             //if vote_types dont match then swap over the types and adjust votes by 2(ie downvoting a previously upvoted post causes a swing of 2 )
    //             setLikedComments(currLikedComments => {
    //                 const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
    //                 const theLikedComment = newLikedComments.find(comment => comment.comment_id === comment_id);
    //                 theLikedComment.vote_type = theLikedComment.vote_type === 'up' ? 'down' : 'up';
    //                 return newLikedComments;

    //             })
    //             setCommentsList(currComments => {
    //                 const newComments = currComments.map(comment => { return { ...comment } });
    //                 const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
    //                 commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes + 2 : commentToEdit.votes - 2;
    //                 return newComments;
    //             })
    //         }
    //     }
    //     patchCommentVotes(comment_id, vote_type, loggedInUser).catch(e => console.log(e.response))
    // }
    // }
    console.log(totalItems);
    if (err) return <Error err={err} setErr={setErr} />

    if (isLoading) return <Loading />

    return (
        <div>
            <div className={styles['reviews-container']}>



                <div key={review.review_id} className={styles['review-box']}>
                    <div className={styles['review-box-info-bar']}>
                        <ul className={styles['review-box-info-bar-list']}>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Reviewed By</p>
                                <p className={styles['info-text']}><a href='#'>{review.owner}</a></p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Category</p>
                                <p className={styles['info-text']}><a href='#'>{review.category}</a></p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Date posted</p>
                                <p className={styles['info-text']}>{review.created_at}</p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Votes</p>
                                <p className={styles['info-text']}>

                                    <ReviewsVotes setErr={setErr} reviewObj={review} loggedInUser={loggedInUser} likedReviews={likedReviews} review={review} setLikedReviews={setLikedReviews} setReview={setReview}   >
                                        {review.votes}
                                    </ReviewsVotes>

                                    {/* <span style={{ color: likedReviews.some(reviewObj => review.review_id === reviewObj.review_id) && likedReviews.find(reviewObj => review.review_id === reviewObj.review_id).vote_type === 'down' ? 'red' : '' }} onClick={() => { changeVotes(review.review_id, 'down', loggedInUser) }} */}
                                    {/* // className={styles['votes-thumbs']}><i className="far fa-thumbs-down"> </i> </span> */}
                                    {/* {review.votes} */}
                                    {/* <span style={{ color: likedReviews.some(reviewObj => review.review_id === reviewObj.review_id) && likedReviews.find(reviewObj => review.review_id === reviewObj.review_id).vote_type === 'up' ? 'blue' : '' }} className={styles['votes-thumbs']} onClick={() => { changeVotes(review.review_id, 'up', loggedInUser) }}> <i className="far fa-thumbs-up"></i></span> */}
                                </p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Comments</p>
                                <p className={styles['info-text']}>{review.comment_count}</p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <div className={styles["add-comment-buttons-container"]}>
                                    <span onClick={() => { setPostingComment(currState => !currState) }} className={styles["add-comment-button"]}><i class="fas fa-plus create-and-top-buttons"></i></span>
                                </div>
                            </li>

                        </ul>
                    </div>
                    <div className={styles['main-review-box']}>
                        <img className={styles['review-image']} alt="review" src="https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                        <div className={styles['review-text']}>
                            <h3>{review.title} {review.designer ? ` - By  ${review.designer}` : ''}</h3>


                            {edittingReview.edittingReview && edittingReview.reviewToEdit === review.review_id ?
                                <EditReviewsForm setErr={setErr} newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} reviewEditError={reviewEditError} reviewObj={review} setReviewEditError={setReviewEditError} setEdittingReview={setEdittingReview} setReview={setReview} />


                                : <p className={styles['review-body-paragraph l4']}>{review.review_body}</p>}
                        </div>
                    </div>
                    {review.owner === loggedInUser.username && <>
                        <EditReviewsButton reviewObj={review} setEdittingReview={setEdittingReview} setNewReviewInput={setNewReviewInput} setReviewEditError={setReviewEditError} />

                        {/* <span className={styles['edit-button']}><i class="far fa-edit"></i></span> */}
                        <span onClick={() => {
                            if (window.confirm('Are you sure you wish to delete this item? This action cannot be undone')) {
                                deleteReview(review.review_id).catch(e => {
                                    setErr({
                                statusCode : e.response ? e.response.status : '',
                                msg : 'Something went wrong. Please try again'

                                    })
                                })
                                //need to return to main page here....

                                // setReviewsList(currReviews => {
                                //       const newReviews = currReviews.map(review => { return { ...review } });
                                //       const deletedIndex = newReviews.findIndex(review => review.review_id === reviewObj.review_id);
                                //       newReviews.splice(deletedIndex, 1);
                                //       return newReviews;
                                // })
                            }
                        }} className={styles['delete-button']}>  <i class="far fa-trash-alt"></i> </span> </>}

                </div>





            </div>
            {isLoadingComments && <Loading />}
            {!postingComment && totalItems > 0 ? <div className={styles['comments-container']}>
                {
                    commentsList.map((commentObj) => {
                        return (
                            <div key={commentObj.comment_id} className={styles['comment-box']}>
                                <div className={styles['comment-box-info-bar']}>
                                    <ul className={styles['comment-box-info-bar-list']}>
                                        <li className={styles['comment-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>commented By</p>
                                            <p className={styles['info-text']}><a href='#'>{commentObj.author}</a></p>
                                            <p className={styles['info-text']}><a href='#'>{commentObj.comment_id}</a></p>

                                        </li>

                                        <li className={styles['comment-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Date posted</p>
                                            <p className={styles['info-text']}>{commentObj.created_at}</p>
                                        </li>
                                        <li className={styles['comment-box-info-bar-list-item']}>
                                            <p className={styles['info-header']}>Votes</p>
                                            <p className={styles['info-text']}>

                                                <CommentsVotes setErr={setErr} likedComments={likedComments} commentObj={commentObj} loggedInUser={loggedInUser} commentsList={commentsList} setLikedComments={setLikedComments} setCommentsList={setCommentsList} >
                                                    {commentObj.votes}
                                                </CommentsVotes>

                                                {/* <span style={{ color: likedComments.some(comment => comment.comment_id === commentObj.comment_id) && likedComments.find(comment => comment.comment_id === commentObj.comment_id).vote_type === 'down' ? 'red' : '' }} onClick={() => { changeCommentVotes(commentObj.comment_id, 'down', loggedInUser) }} */}
                                                {/* // className={styles['votes-thumbs']}><i className="far fa-thumbs-down"> </i> </span> */}
                                                {/* {commentObj.votes} */}
                                                {/* <span style={{ color: likedComments.some(comment => comment.comment_id === commentObj.comment_id) && likedComments.find(comment => comment.comment_id === commentObj.comment_id).vote_type === 'up' ? 'blue' : '' }} className={styles['votes-thumbs']} onClick={() => { changeCommentVotes(commentObj.comment_id, 'up', loggedInUser) }}> <i className="far fa-thumbs-up"></i></span> */}
                                            </p>
                                        </li>



                                    </ul>
                                </div>
                                <div className={styles['main-comments-box']}>
                                    <div className={styles['comments-text']}>
                                        <h3>{commentObj.title}</h3>


                                        {edittingComment.edittingComment && edittingComment.commentToEdit === commentObj.comment_id ?
                                            <EditCommentsForm setTotalItems={setTotalItems} setErr={setErr} newCommentInput={newCommentInput} setNewCommentInput={setNewCommentInput} commentEditError={commentEditError} commentObj={commentObj} setCommentEditError={setCommentEditError} setEdittingComment={setEdittingComment} setCommentsList={setCommentsList} />

                                            : <p className={styles['comments-body-paragraph l4']}>{commentObj.body}</p>}




                                    </div>
                                </div>

                                {commentObj.author === loggedInUser.username && <>
                                    <EditCommentsButton commentObj={commentObj} setEdittingComment={setEdittingComment} setNewCommentInput={setNewCommentInput} setCommentEditError={setCommentEditError} />
                                    {/* <span className={styles['edit-button']}><i class="far fa-edit"></i></span> */}

                                    <span onClick={() => {
                                        if (window.confirm('Are you sure you wish to delete this item? This action cannot be undone')) {
                                            setCommentsList(currComments => {
                                                const newCommentss = currComments.map(comments => { return { ...comments } });
                                                const deletedIndex = newCommentss.findIndex(comments => comments.comment_id === commentObj.comment_id);
                                                newCommentss.splice(deletedIndex, 1);
                                                return newCommentss;
                                            })
                                            deleteComment(commentObj.comment_id).catch(e => {
                                                setErr({
                                                    statusCode: e.response ? e.response.status : '',

                                                    msg: 'There was a problem deleting your message, please try again'
                                                });
                                            })

                                setTotalItems(currCount => currCount - 1)
                                            

                                        }
                                    }} className={styles['delete-button']}>  <i class="far fa-trash-alt"></i> </span> </>}

                            </div>
                        )
                    })

                }

            </div> : <AddComment setTotalItems={setTotalItems} loggedInUser={loggedInUser} review_id={review.review_id} setPostingComment={setPostingComment} setCommentsList={setCommentsList} />}
            {totalItems > 0 ? <Pagination setFilters={setFilters} totalItems={totalItems} filters={filters} /> :
                // <div className={styles['comment-box']}>
                //     <div className={styles['comment-box-info-bar']}>
                //         No comments to display
                //     </div>
                // </div>
                ''
                }

        </div>
    )
}
