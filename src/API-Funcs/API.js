import axios from "axios";

const reviewsAPI = axios.create({
    baseURL: "https://nc-games-scott.herokuapp.com/api/",
});



export const getReviews = async (filters) => {
    const response = await reviewsAPI.get('/reviews', {
        params: {
            p: filters.p,
            sort_by: filters.sort_by,
            limit: filters.limit,
            category: filters.category,
            minutes: filters.minutes,
            hours: filters.hours,
            days: filters.days,
            months: filters.months,
            order: filters.order,
        }
    });
    return response.data;

}
export const getCommentsByReviewId = async (review_id, filters) => {
    const response = await reviewsAPI.get(`/reviews/${review_id}/comments`, {
        params: {

            p: filters.p,
            limit: filters.limit
        }
    });
    return response.data;
}

export const getReviewById = async (review_id) => {
    const response = await reviewsAPI.get(`/reviews/${review_id}`);
    return response.data;

}

export const getUserByUsername = async (user) => {
    const response = await reviewsAPI.get(`/users/${user}`);
    return response.data;

}

export const getCategories = async () => {
    const response = await reviewsAPI.get(`/categories`);
    return response.data;
}

export const getUsers = async () => {
    const response = await reviewsAPI.get(`/users`);
    return response.data;
}

export const patchVotes = async (review_id, vote_type, voted_by) => {
     await reviewsAPI.patch(`/reviews/${review_id}`, { voted_by: voted_by, vote_type: vote_type });
}

export const patchCommentVotes = async (comment_id, vote_type, voted_by) => {
    await reviewsAPI.patch(`/comments/${comment_id}`, { voted_by: voted_by, vote_type: vote_type });
}

export const patchReview = async (review_id, review_body) => {
     await reviewsAPI.patch(`/reviews/${review_id}`, { review_body: review_body });
}
export const patchComment = async (comment_id, body) => {
    await reviewsAPI.patch(`/comments/${comment_id}`, { body: body });
}
export const getLikedReviews = async (user) => {
    const response = await reviewsAPI.get(`/votes/${user}/reviews`);
    return response.data;
}

export const getCommentedReviewsByUsername = async (user) => {
    const response = await reviewsAPI.get(`/comments/${user}/reviews`);
    return response.data;

}

export const getLikedComments = async (user) => {
    const response = await reviewsAPI.get(`/votes/${user}/comments`);
    return response.data;
}

export const postReview = async (postBody) => {
    const response = await reviewsAPI.post(`/reviews`, postBody);
    return response.data;
}

export const postComment = async (postBody, review_id) => {
    const response = await reviewsAPI.post(`/reviews/${review_id}/comments`, postBody);
    return response.data;
}

export const deleteReview = async (review_id) => {
    await reviewsAPI.delete(`/reviews/${review_id}`);
}
export const deleteComment = async (comment_id) => {
     await reviewsAPI.delete(`/comments/${comment_id}`);
}

