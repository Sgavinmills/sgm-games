import './App.css';
import Header from './components/Header.jsx'
import Reviews from './components/Reviews.jsx'
import AddReview from './components/AddReview.jsx'
import SingleReview from './components/SingleReview.jsx'




import { Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories, getLikedReviews, getLikedComments } from './API-Funcs/API';



function App() {
    //just testing these 3 here, used for both kind of review editting
    const [newReviewInput, setNewReviewInput] = useState('');
    const [reviewEditError, setReviewEditError] = useState([false]);
    const [edittingReview, setEdittingReview] = useState({edittingReview : false, reviewToEdit : ''});


    const [newCommentInput, setNewCommentInput] = useState('');
    const [commentEditError, setCommentEditError] = useState([false]);
    const [edittingComment, setEdittingComment] = useState({edittingComment : false, commentToEdit : ''});


  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('tickle122')
  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data.categories);
      })
  }, [loggedInUser])

  useEffect(() => {
    getLikedReviews(loggedInUser) 
      .then(data => {
        setLikedReviews(data.reviews);
      })
  }, [loggedInUser])



  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/">
          <Reviews newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} reviewEditError={reviewEditError} setReviewEditError={setReviewEditError} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
        <Route exact path="/reviews">
          <Reviews newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} reviewEditError={reviewEditError} setReviewEditError={setReviewEditError} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
        <Route exact path="/addreview">
          <AddReview categories={categories} loggedInUser={loggedInUser} />
        </Route>

        {/* delete editreview.jsx then remove this  */}
        {/* <Route exact path="/editreview/:review_id">
          <EditReview />
        </Route> */}
        <Route exact path="/review/:review_id">
          <SingleReview edittingComment={edittingComment} setEdittingComment={setEdittingComment} commentEditError={commentEditError} setCommentEditError={setCommentEditError} newCommentInput={newCommentInput} setNewCommentInput={setNewCommentInput} newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} reviewEditError={reviewEditError} setReviewEditError={setReviewEditError} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
     
      </Switch>
    </div>
  );
}

export default App;
