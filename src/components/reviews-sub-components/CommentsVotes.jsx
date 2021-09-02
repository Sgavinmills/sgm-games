import styles from '../CSS/Reviews.module.css'
import { patchCommentVotes } from '../../API-Funcs/API';

export default function CommentsVotes({setErr, likedComments, commentObj, loggedInUser, commentsList, setLikedComments, setCommentsList}) {
    return (
        <p className={styles['info-text']}>
            <span style={{ color: likedComments.some(comment => comment.comment_id === commentObj.comment_id) && likedComments.find(comment => comment.comment_id === commentObj.comment_id).vote_type === 'down' ? 'red' : '' }} onClick={() => { changeCommentVotes(commentObj.comment_id, 'down', loggedInUser) }}
                className={styles['votes-thumbs']}><i className="far fa-thumbs-down"> </i> </span>
            {commentObj.votes}
            <span style={{ color: likedComments.some(comment => comment.comment_id === commentObj.comment_id) && likedComments.find(comment => comment.comment_id === commentObj.comment_id).vote_type === 'up' ? 'blue' : '' }} className={styles['votes-thumbs']} onClick={() => { changeCommentVotes(commentObj.comment_id, 'up', loggedInUser) }}> <i className="far fa-thumbs-up"></i></span>

        </p>
    )

   function changeCommentVotes(comment_id, vote_type, loggedInUser){
        const theLikedComment = likedComments.find(comment => comment.comment_id === comment_id);
        const thisComment = commentsList.find(comment => comment.comment_id === comment_id);
        if((thisComment.votes === 0 && vote_type === 'down') || (theLikedComment && vote_type === 'down' && thisComment.votes === 1)) {} else {
        if (!theLikedComment) {
            //if its not in the liked review list then stick in in the likedReview list
                setLikedComments(currLikedComments => {
                    const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
                    const newCommentToEdit = { ...thisComment };
                    newCommentToEdit.vote_type = vote_type;
                    newLikedComments.push(newCommentToEdit);
                    return newLikedComments;
                })
                setCommentsList(currComments => {
                    const newComments = currComments.map(comment => { return { ...comment } });
                    const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
                    commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes + 1 : commentToEdit.votes - 1;
                    return newComments;
                })
            
        } else {
            //if it is in the liked review list if the vote_Type in the liked review list matches the vote_Type then yoink it from the liked list
            if (theLikedComment.vote_type === vote_type) {
                setLikedComments(currLikedComments => {
                    const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
                    const theLikedCommentIndex = newLikedComments.findIndex(comment => comment.comment_id === comment_id);
                    newLikedComments.splice(theLikedCommentIndex, 1);
                    return newLikedComments;
                })
                setCommentsList(currComments => {
                    const newComments = currComments.map(comment => { return { ...comment } });
                    const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
                    commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes - 1 : commentToEdit.votes + 1;
                    return newComments;
                })
            } else {
                //if vote_types dont match then swap over the types and adjust votes by 2(ie downvoting a previously upvoted post causes a swing of 2 )
                setLikedComments(currLikedComments => {
                    const newLikedComments = currLikedComments.map(comment => { return { ...comment } });
                    const theLikedComment = newLikedComments.find(comment => comment.comment_id === comment_id);
                    theLikedComment.vote_type = theLikedComment.vote_type === 'up' ? 'down' : 'up';
                    return newLikedComments;

                })
                setCommentsList(currComments => {
                    const newComments = currComments.map(comment => { return { ...comment } });
                    const commentToEdit = newComments.find(comment => comment.comment_id === comment_id);
                    commentToEdit.votes = vote_type === 'up' ? commentToEdit.votes + 2 : commentToEdit.votes - 2;
                    return newComments;
                })
            }
        }
        patchCommentVotes(comment_id, vote_type, loggedInUser.username).catch(e => {
            setErr({
                statusCode : e.response ? e.response.status : '',
                msg : 'There was a problem, please try again'
            });
        })
        
    }
    }

}
