import styles from "./CSS/Reviews.module.css";
import { Link } from "react-router-dom";

export default function Categories({ categories, setCategories }) {
  return (
    <div>
      <div className={styles["reviews-container"]}>
        {categories.map((category) => {
          return (
            <div key={category.slug} className={styles["review-box"]}>
              <div className={styles["category-box-info-bar"]}>
                <p className={styles["info-header"]}>
                  <Link to={`/reviews/${category.slug}`}>
                    {category.slug}{" "}
                  </Link>
                </p>
              </div>
              <div className={styles["main-category-box"]}>
                <p className={styles["info-text"]}> {category.description} </p>
                <Link to={`/reviews/${category.slug}`}>
                  <p> View all reviews....</p>{" "}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
