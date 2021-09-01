import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { getReviewById, getCommentsByReviewId, deleteReview, getLikedComments, deleteComment } from "../API-Funcs/API";
import styles from './CSS/Reviews.module.css'
import AddComment from './AddComment.jsx'
import Loading from './Loading';
import { useHistory } from 'react-router';

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
    let history = useHistory();

    const returnToHomePage = () => {
        history.push('/reviews');
    }
    useEffect(() => {
        setIsLoadingComments(true);
        setIsLoading(true);
        setErr(null);
        getReviewById(review_id)
            .then((response) => {
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
    }, [review_id, filters, setIsLoading])

    useEffect(() => {
        getLikedComments(loggedInUser.username)
            .then(data => {
                setLikedComments(data.comments);
            })
    }, [loggedInUser])

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
                                <p className={styles['info-text']}>{review.owner}</p>
                            </li>
                            <li className={styles['review-box-info-bar-list-item']}>
                                <p className={styles['info-header']}>Category</p>
                                <p className={styles['info-text']}>{review.category}</p>
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
                        <span onClick={() => {
                            if (window.confirm('Are you sure you wish to delete this item? This action cannot be undone')) {
                                deleteReview(review.review_id).catch(e => {
                                    setErr({
                                        statusCode: e.response ? e.response.status : '',
                                        msg: 'Something went wrong. Please try again'

                                    })
                                })
                                returnToHomePage();
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
                                            <p className={styles['info-text']}>{commentObj.author}</p>
                                            <p className={styles['info-text']}>{commentObj.comment_id}</p>

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
                ''
            }

        </div>
    )
}
