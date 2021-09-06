# nc-games-scott, Northcoders project

## Contents
- [Background](#background)
- [Technologies](#technologies)
- [Set-up for local use](#setup)
- [Live version](#live)

<a name=background></a>
## Background

This react website was made to help consolidate my understanding of making a C.R.U.D application. It is a board-game review website where users can view existing reviews or add their own.

All reviews can be commented on, voted on and if applicable deleted or editted. All reviews, comments and votes are stored in the database and will persist across refreshes and user switching.

The site is hosted on Netlify and is available to view [here](https://sgm-games.netlify.app/reviews).

The source code can be viewed and downloaded from [github](https://github.com/Sgavinmills/sgm-games).

The backend server is hosted on [heroku](https://nc-games-scott.herokuapp.com/api/)

The source code for backend can be viewed and downloaded from [github](https://github.com/Sgavinmills/nc-games-scott)


<a name=technologies></a>
## Technologies

- [ReactJS](https://reactjs.org/) ^17.0.2
- [Node JS](https://nodejs.org/en/) v16.2.0

### Dependencies:
- [Axios](https://axios-http.com/docs/intro) ^0.21.1
- [react-dom]() ^17.0.2
- [react-router-dom]() ^5.2.0


<a name=setup></a>
## Setup

Follow these steps to download the project onto your own machine:

- Clone the repo
~~~
git clone https://github.com/Sgavinmills/sgm-games.git
~~~

- Navigate into the src directory

- Install all dependencies
~~~
npm install
~~~

- Load the site on localhost with react
~~~
npm start
~~~

After a few moments the site will start in a new browser tab. You will be logged in as user 'tickle222' by default. As this is purely a demonstration project you can change the user by visitng the 'users' page and try adding reviews/comments with a different user. 


<a name=backend></a>
## Back-end

The back-end was created as project during the back-end phase of Northcoders bootcamp. 

It is available to view on [github](https://github.com/Sgavinmills/nc-games-scott)
A live version of the server can be seen on [heroku](https://nc-games-scott.herokuapp.com/api/)

 

<a name=live></a>
## Live Version
The live version of the application can be viewed [here](https://sgm-games.netlify.app/reviews)