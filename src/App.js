import './App.css';
import Header from './components/Header.jsx'
import Reviews from './components/Reviews.jsx'

import { Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories, getLikedReviews, getLikedComments } from './API-Funcs/API';



function App() {

  const [categories, setCategories] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('tickle122')
  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data.categories);
      })
  }, [])

  useEffect(() => {
    getLikedReviews(loggedInUser) 
      .then(data => {
        setLikedReviews(data.reviews);
      })
  }, [])

  useEffect(() => {
    getLikedComments(loggedInUser) 
      .then(data => {
        setLikedComments(data.comments);
      })
  }, [])

  console.log(likedComments)

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/">
          <Reviews loggedInUser={loggedInUser} categories={categories} likedReviews={likedReviews} setLikedReviews={setLikedReviews} />
        </Route>
        <Route exact path="/reviews">
          <Reviews />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
