import { useEffect, useState } from "react";
import { getReviews } from "../API-Funcs/API";
import styles from "./CSS/Reviews.module.css";
import Filters from "./reviews-sub-components/Filters";
import Pagination from "./reviews-sub-components/Pagination";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import EditReviewsButton from "./reviews-sub-components/EditReviewsButton";
import EditReviewsForm from "./reviews-sub-components/EditReviewsForm";
import ReviewsVotes from "./reviews-sub-components/ReviewsVotes";
import Error from "./Error";
import DeleteReviewButton from "./reviews-sub-components/DeleteReviewButton";
import { convertTime } from "./utils/utils";
import { useParams } from "react-router-dom";

export default function Reviews({
  isLoading,
  setIsLoading,
  categories,
  loggedInUser,
  likedReviews,
  setLikedReviews,
  newReviewInput,
  setNewReviewInput,
  edittingReview,
  setEdittingReview,
}) {
  const [reviewsList, setReviewsList] = useState([]);
  const { categoryName } = useParams();
  const [err, setErr] = useState(null);
  const [filters, setFilters] = useState({
    p: 1,
    sort_by: null,
    limit: 10,
    category: categoryName,
    minutes: null,
    hours: null,
    days: null,
    months: null,
  });

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setErr(null);
    setIsLoading(true);
    getReviews(filters)
      .then((data) => {
        setReviewsList(data.reviews);
        setTotalItems(data.total_count);
        setIsLoading(false);
      })
      .catch((e) => {
        setErr({
          statusCode: e.response ? e.response.status : "",
          msg: e.response
            ? e.response.data.message
            : "There was an error. Please try again",
        });
      });
  }, [filters, setIsLoading]);
  if (err) return <Error err={err} setErr={setErr} />;
  if (isLoading) return <Loading />;
  return (
    <div>
      <div className={styles["reviews-container"]}>
        {reviewsList.map((reviewObj) => {
          return (
            <div key={reviewObj.review_id} className={styles["review-box"]}>
              <div className={styles["review-box-info-bar"]}>
                <ul className={styles["review-box-info-bar-list"]}>
                  <li
                    className={`${styles["review-box-info-bar-list-item"]} ${styles["list-item-date-posted"]}`}
                  >
                    <p className={styles["info-header"]}>Reviewed By</p>
                    <p className={styles["info-text"]}>{reviewObj.owner}</p>
                  </li>
                  <li className={styles["review-box-info-bar-list-item"]}>
                    <p className={styles["info-header"]}>Category</p>
                    <p className={styles["info-text"]}>{reviewObj.category}</p>
                  </li>
                  <li
                    className={`${styles["review-box-info-bar-list-item"]} ${styles["list-item-date-posted"]}`}
                  >
                    <p className={styles["info-header"]}>Date posted</p>
                    <p className={styles["info-text"]}>
                      {convertTime(reviewObj.created_at)}
                    </p>
                  </li>
                  <li className={styles["review-box-info-bar-list-item"]}>
                    <p className={styles["info-header"]}>Votes</p>
                    <p className={styles["info-text"]}>
                      <ReviewsVotes
                        setErr={setErr}
                        reviewObj={reviewObj}
                        loggedInUser={loggedInUser}
                        likedReviews={likedReviews}
                        reviewsList={reviewsList}
                        setLikedReviews={setLikedReviews}
                        setReviewsList={setReviewsList}
                      >
                        {reviewObj.votes}
                      </ReviewsVotes>
                    </p>
                  </li>
                  <li className={styles["review-box-info-bar-list-item"]}>
                    <Link
                      className={styles.link}
                      to={`/review/${reviewObj.review_id}`}
                    >
                      {" "}
                      <p className={styles["info-header"]}>Comments</p>
                    </Link>
                    <p className={styles["info-text"]}>
                      {reviewObj.comment_count}
                    </p>
                  </li>
                </ul>
              </div>
              <div className={styles["main-review-box"]}>
                <img
                  className={styles["review-image"]}
                  alt="review"
                  src={reviewObj.review_img_url}
                />

                <div className={styles["review-text"]}>
                  <h3>{reviewObj.title}</h3>
                  {edittingReview.edittingReview &&
                  edittingReview.reviewToEdit === reviewObj.review_id ? (
                    <EditReviewsForm
                      setErr={setErr}
                      newReviewInput={newReviewInput}
                      setNewReviewInput={setNewReviewInput}
                      reviewObj={reviewObj}
                      setEdittingReview={setEdittingReview}
                      setReviewsList={setReviewsList}
                    />
                  ) : (
                    <>
                      <p className={styles["review-body-paragraph"]}>
                        {reviewObj.review_body}
                      </p>{" "}
                      <p className={styles["extra-info-mobile"]}>
                        Reviewed by {reviewObj.owner} -{" "}
                        {Date(reviewObj.created_at).substring(
                          0,
                          Date(reviewObj.created_at).length - 31
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {reviewObj.owner === loggedInUser.username && (
                <>
                  <EditReviewsButton
                    reviewObj={reviewObj}
                    setEdittingReview={setEdittingReview}
                    setNewReviewInput={setNewReviewInput}
                  />
                  <DeleteReviewButton
                    reviewObj={reviewObj}
                    setReviewsList={setReviewsList}
                    setErr={setErr}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles["create-and-top-buttons-container"]}>
        <Link className={styles.link} to="/addreview">
          {" "}
          <span className={styles["add-review-button"]}>
            <i className="fas fa-plus create-and-top-buttons"></i>
          </span>
        </Link>
      </div>
      <Filters
        categories={categories}
        setFilters={setFilters}
        filters={filters}
      />
      <Pagination
        setFilters={setFilters}
        totalItems={totalItems}
        filters={filters}
      />
    </div>
  );
}
