import './App.css';
import Header from './components/Header.jsx'
import Reviews from './components/Reviews.jsx'
import AddReview from './components/AddReview.jsx'
import SingleReview from './components/SingleReview.jsx'
import Categories from './components/Categories.jsx'
import { Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories, getLikedReviews } from './API-Funcs/API';
import Error from './components/Error';

function App() {
  const [newReviewInput, setNewReviewInput] = useState('');
  const [edittingReview, setEdittingReview] = useState({ edittingReview: false, reviewToEdit: '' });
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({
    username: 'tickle122',
    access: 'admin'
  });

  useEffect(() => {
    setErr(null);
    getCategories()
      .then(data => {
        setCategories(data.categories);
      }).catch(e => {
        setErr({
          statusCode: e.response ? e.response.status : '',
          msg: 'There was a problem, please try again'
        });
      })
  }, [loggedInUser])

  useEffect(() => {
    setErr(null);
    getLikedReviews(loggedInUser.username)
      .then(data => {
        setLikedReviews(data.reviews);
      }).catch(e => {
        setErr({
          statusCode: e.response ? e.response.status : '',
          msg: 'There was a problem, please try again'
        });
      })
  }, [loggedInUser])



  if (err) return (
    <div className="App">
      <Header />
      <Error err={err} />
    </div>
  )

  return (
    <div className="App">
      <Header />
      <Switch>
      
        <Route exact path="/reviews">
          <Reviews newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
        <Route exact path="/addreview">
          <AddReview categories={categories} loggedInUser={loggedInUser} />
        </Route>
        <Route exact path="/categories">
          <Categories categories={categories} setCategories={setCategories} />
        </Route>

        <Route exact path="/review/:review_id">
          <SingleReview setErr={setErr}  newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>

        <Route path="/">
          <Reviews newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>

      </Switch>
    </div>
  );
}

export default App;
