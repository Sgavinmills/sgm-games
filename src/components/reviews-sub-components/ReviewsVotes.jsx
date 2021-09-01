import styles from '../CSS/Reviews.module.css'
import { patchVotes } from '../../API-Funcs/API';

export default function ReviewsVotes({setErr, likedReviews, reviewObj, loggedInUser, setLikedReviews, reviewsList, setReviewsList, review, setReview}) {
    return (
        <>
            <span style={{ color: likedReviews.some(review => review.review_id === reviewObj.review_id) && likedReviews.find(review => review.review_id === reviewObj.review_id).vote_type === 'down' ? 'red' : '' }} onClick={() => { changeVotes(reviewObj.review_id, 'down', loggedInUser) }}
                className={styles['votes-thumbs']}><i className="far fa-thumbs-down"> </i> </span>
            {reviewObj.votes}
            <span style={{ color: likedReviews.some(review => review.review_id === reviewObj.review_id) && likedReviews.find(review => review.review_id === reviewObj.review_id).vote_type === 'up' ? 'blue' : '' }} className={styles['votes-thumbs']} onClick={() => { changeVotes(reviewObj.review_id, 'up', loggedInUser) }}> <i className="far fa-thumbs-up"></i></span>

        </>

    )
    function changeVotes(review_id, vote_type, loggedInUser) {
        const theLikedReview = likedReviews.find(review => review.review_id === review_id);
        const thisReview = reviewsList ? reviewsList.find(review => review.review_id === review_id) : review;
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
                if(setReviewsList) {

                    setReviewsList(currReviews => {
                        const newReviews = currReviews.map(review => { return { ...review } });
                        const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                        reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes + 1 : reviewToEdit.votes - 1;
                        return newReviews;
                    })
                } else {
                    setReview(currReview => {
                        const newReview = {...currReview};
                        newReview.votes = vote_type === 'up' ? newReview.votes + 1 : newReview.votes - 1;
                        return newReview;
                    })
                }
    
            } else {
                //if it is in the liked review list if the vote_Type in the liked review list matches the vote_Type then yoink it from the liked list
                if (theLikedReview.vote_type === vote_type) {
                    setLikedReviews(currLikedReviews => {
                        const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
                        const theLikedReviewIndex = newLikedReviews.findIndex(review => review.review_id === review_id);
                        newLikedReviews.splice(theLikedReviewIndex, 1);
                        return newLikedReviews;
                    })
                    if(reviewsList) {

                        setReviewsList(currReviews => {
                            const newReviews = currReviews.map(review => { return { ...review } });
                            const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                            reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes - 1 : reviewToEdit.votes + 1;
                            return newReviews;
                        })
                    } else {
                        setReview(currReview => {
                            const newReview = {...currReview}
                            newReview.votes = vote_type === 'up' ? newReview.votes - 1 : newReview.votes + 1;
                            return newReview;
                        })
                    }
                } else {
                    //if vote_types dont match then swap over the types and adjust votes by 2(ie downvoting a previously upvoted post causes a swing of 2 )
                    setLikedReviews(currLikedReviews => {
                        const newLikedReviews = currLikedReviews.map(review => { return { ...review } });
                        const theLikedReview = newLikedReviews.find(review => review.review_id === review_id);
                        theLikedReview.vote_type = theLikedReview.vote_type === 'up' ? 'down' : 'up';
                        return newLikedReviews;
    
                    })
                    if(reviewsList) {

                        setReviewsList(currReviews => {
                            const newReviews = currReviews.map(review => { return { ...review } });
                            const reviewToEdit = newReviews.find(review => review.review_id === review_id);
                            reviewToEdit.votes = vote_type === 'up' ? reviewToEdit.votes + 2 : reviewToEdit.votes - 2;
                            return newReviews;
                        })
                    } else {
                        setReview(currReview => {
                            const newReview = {...currReview}
                            newReview.votes = vote_type === 'up' ? newReview.votes + 2 : newReview.votes - 2;
                            return newReview;
                        })
                    }
                }
            }
            //when we do error handling prob need to move this up into the blocks above, so can revert the optimisitc rendering easier
            patchVotes(review_id, vote_type, loggedInUser.username).catch(e => {
                setErr({
                    statusCode : e.response ? e.response.status : '',
                    msg : 'Something went wrong please try again'
                })
            })
        }
    }
}
