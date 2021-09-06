import styles from "../CSS/Reviews.module.css";

export default function EditReviewsButton({
  setEdittingComment,
  setNewCommentInput,
  commentObj,
}) {
  return (
    <button
      className={styles["edit-button"]}
      onClick={() => {
        setEdittingComment((currObj) => {
          const newEditObj = { ...currObj };
          newEditObj.edittingComment = !newEditObj.edittingComment;
          newEditObj.commentToEdit = commentObj.comment_id;
          return newEditObj;
        });
        setNewCommentInput(commentObj.body);
      }}
    >
      <i className="far fa-edit"></i>
    </button>
  );
}
