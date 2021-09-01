import styles from '../CSS/Reviews.module.css'

export default function EditReviewsButton({setEdittingComment, setNewCommentInput, commentObj}) {
    return (
        
            <span className={styles['edit-button']} onClick={() => { setEdittingComment(currObj => {
                                     const newEditObj = {...currObj};
                                     newEditObj.edittingComment = !newEditObj.edittingComment;
                                     newEditObj.commentToEdit = commentObj.comment_id;
                                     return newEditObj;
                                 })
                                setNewCommentInput(commentObj.body);

                                }}><i class="far fa-edit"></i>
            </span> 
        
    )
}
