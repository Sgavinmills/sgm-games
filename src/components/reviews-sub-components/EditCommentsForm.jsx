import React from 'react'
import { patchComment } from '../../API-Funcs/API';
import styles from '../CSS/Reviews.module.css'
import { useState } from 'react';


export default function EditCommentsForm({setCommentEditError, setEdittingComment, setCommentsList, commentEditError, commentObj, newCommentInput, setNewCommentInput, setComment}) {
    console.log(commentEditError);
    return (
            
            <form onSubmit={event => {
                                        event.preventDefault();
                                        if(newCommentInput.length < 20 || newCommentInput.length > 2000) {
                                            setCommentEditError(true);
                                        } else {
                                            //patch review
                                            patchComment(commentObj.comment_id, newCommentInput);
                                            setCommentEditError(false);
                                            setEdittingComment({edittingComment : false, commentToEdit : ''});
                                            if(setCommentsList) {
                                            setCommentsList(currCommentList => {
                                                const newCommentList = currCommentList.map(comment => { return {...comment }});
                                                const edittedComment = newCommentList.find(comment => comment.comment_id === commentObj.comment_id);
                                                edittedComment.body = newCommentInput;
                                                return newCommentList;
                                            })
                                        } else {
                                            setComment(currComment => {
                                                const newComment = {...currComment};
                                                newComment.comment = newCommentInput;
                                                
                                                return newComment;
                                            })
                                        }
                                            setNewCommentInput('');
                                        }

                                    }}>
                                      <input className={styles['form-edit-body']} type="text" value={newCommentInput} onChange={(event) => setNewCommentInput(event.target.value)}
                                       ></input>
                                     { commentEditError && <p className={styles['error-paragraph']}>Comment must be between 20 and 2000 chars</p>}
                                          <div><br />
                                              <input type="submit" value="Submit comment" /> </div>
                                      
            </form>
        
    )
}
