import axios from "axios";

const reviewsAPI = axios.create({
    baseURL: "https://nc-games-scott.herokuapp.com/api/",
});

export const getReviews = async (filters) => {
    const response = await reviewsAPI.get('/reviews', {
        params : {
            p : filters.p,
            sort_by : filters.sort_by,
            limit : filters.limit,
            category : filters.category,
            minutes : filters.minutes,
            hours : filters.hours,
            days : filters.days,
            months : filters.months,
            order : filters.order,
        }
    });
    return response.data;

}

export const getReviewById = async (review_id) => {
    const response = await reviewsAPI.get(`/reviews/${review_id}`);
    return response.data;

}

export const getCategories = async () => {
    const response = await reviewsAPI.get(`/categories`);
    return response.data;
}