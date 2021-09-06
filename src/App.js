import './App.css';
import Header from './components/Header.jsx'
import Reviews from './components/Reviews.jsx'
import AddReview from './components/AddReview.jsx'
import SingleReview from './components/SingleReview.jsx'
import Categories from './components/Categories.jsx'
import Users from './components/Users.jsx'
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
      <Header loggedInUser={loggedInUser}/>
      <Error err={err} />
    </div>
  )

  return (
    <div className="App">
      <Header loggedInUser={loggedInUser}/>
      <Switch>
      
        <Route exact path={["/reviews", "/", "/reviews/:categoryName"]}>
          <Reviews newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
        <Route exact path="/addreview">
          <AddReview categories={categories} loggedInUser={loggedInUser} />
        </Route>
        <Route exact path="/categories">
          <Categories categories={categories} isLoading={isLoading} setIsLoading={setIsLoading}/>
        </Route>

        <Route exact path="/review/:review_id">
          <SingleReview setErr={setErr}  newReviewInput={newReviewInput} setNewReviewInput={setNewReviewInput} edittingReview={edittingReview} setEdittingReview={setEdittingReview} isLoading={isLoading} setIsLoading={setIsLoading} loggedInUser={loggedInUser} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>

        <Route exact path="/users">
          <Users setErr={setErr} setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser} setIsLoading={setIsLoading} isLoading={isLoading} />
        </Route>
        

        <Route exact path="/*">
           <Error err={{statusCode : 404, msg : 'Route not found, please try again'}} setErr={setErr}/>
        </Route>

      </Switch>
    </div>
  );
}

export default App;
