import React from "react";
import styles from "../CSS/Reviews.module.css";

export default function EditReviewsButton({
  setEdittingReview,
  setNewReviewInput,
  reviewObj,
}) {
  return (
    <span
      className={styles["edit-button"]}
      onClick={() => {
        setEdittingReview((currObj) => {
          const newEditObj = { ...currObj };
          newEditObj.edittingReview = !newEditObj.edittingReview;
          newEditObj.reviewToEdit = reviewObj.review_id;
          return newEditObj;
        });
        setNewReviewInput(reviewObj.review_body);
      }}
    >
      <i className="far fa-edit"></i>
    </span>
  );
}
