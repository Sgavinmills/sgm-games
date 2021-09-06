import styles from "./CSS/Reviews.module.css";
import { useState, useEffect } from 'react';
import { getUsers } from '../API-Funcs/API';
import Loading from "./Loading";


export default function Users({ loggedInUser, setErr, isLoading, setIsLoading, setLoggedInUser }) {
    const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setErr(null);
    getUsers()
      .then(data => {
        setUsers(data.users);
        setIsLoading(false);
      }).catch(e => {
        setIsLoading(false);
        setErr({
          statusCode: e.response ? e.response.status : '',
          msg: 'There was a problem, please try again'
        });
      })
  }, [loggedInUser, setErr, setIsLoading])

  const switchUser = (username) => {
    setLoggedInUser({ username : username, access : 'admin' })
  }
  if (isLoading) return <Loading />;
  return (
    <div>
      <div className={styles["reviews-container"]}>
        {users.map((user) => {
          return (
            <div key={user.username} className={styles["review-box"]}>
              <div className={styles["users-box-info-bar"]}>
                <p className={styles["info-header"]}>
                
                    {user.username}{" "}
                  
                </p>
              </div>
              <div className={styles["main-category-box"]}>
                <img src={user.avatar_url} className={styles['review-image']} alt="users avatar"/>
                <p>As this is only a demonstration project feel free to switch user and make/edit/delete posts/comments/votes as a different user</p>
                <button className={styles["switch-user-button"]} onClick={() => { switchUser(user.username)}}>Switch User</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
