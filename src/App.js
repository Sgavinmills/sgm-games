import './App.css';
import Header from './components/Header.jsx'
import Reviews from './components/Reviews.jsx'

import { Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories } from './API-Funcs/API';



function App() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data.categories);
      })
  }, [])

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/">
          <Reviews categories={categories} />
        </Route>
        <Route exact path="/reviews">
          <Reviews />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
