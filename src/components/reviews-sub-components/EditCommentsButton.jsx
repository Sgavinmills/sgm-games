import styles from '../CSS/Reviews.module.css'

export default function EditReviewsButton({setEdittingComment, setNewCommentInput, setCommentEditError, commentObj}) {
    return (
        
            <span className={styles['edit-button']} onClick={() => { setEdittingComment(currObj => {
                                     const newEditObj = {...currObj};
                                     newEditObj.edittingComment = !newEditObj.edittingComment;
                                     newEditObj.commentToEdit = commentObj.comment_id;
                                     return newEditObj;
                                 })
                                 console.log(commentObj.body)
                                setNewCommentInput(commentObj.body);
                                setCommentEditError(false);

                                }}><i class="far fa-edit"></i>
            </span> 
        
    )
}
