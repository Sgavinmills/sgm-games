import React from 'react'
import { patchComment } from '../../API-Funcs/API';
import styles from '../CSS/Reviews.module.css'
import { useState } from 'react';
import { deepCopyObj } from '../utils/utils.js'



export default function EditCommentsForm({ setTotalItems, setErr, setEdittingComment, setCommentsList, commentObj, newCommentInput, setNewCommentInput}) {
    const [formErrors, setFormErrors] = useState({
        commentBody: {
            msg: 'Comment body must be between 20-2000 chars',
            error: false,
            checkValid: validateBody
        }
    });
    function validateBody(body) {
        if (body.length < 20 || body.length > 2000) {
            setFormErrors(currErrors => {
                const newErrors = deepCopyObj(currErrors);
                newErrors.commentBody.error = true;
                return newErrors;
            })
        } else setFormErrors(currErrors => {
            const newErrors = deepCopyObj(currErrors);
            newErrors.commentBody.error = false;
            return newErrors;
        })
    }

    function checkFormErrors() {
        for (const property in formErrors) {
            if (formErrors[property].error) {
                return true;
            }
        }
        return false;
    }
    function submitForm() {
        patchComment(commentObj.comment_id, newCommentInput).catch(e => {
            setErr({
                statusCode: e.response.status,
                msg: 'There was a problem, please try again'
            });
        });
        setEdittingComment({ edittingComment: false, commentToEdit: '' });
        setCommentsList(currCommentList => {
            const newCommentList = currCommentList.map(comment => { return { ...comment } });
            const edittedComment = newCommentList.find(comment => comment.comment_id === commentObj.comment_id);
            edittedComment.body = newCommentInput;
            return newCommentList;
        })
    setNewCommentInput('');

    }




return (
    <form onSubmit={event => {
        event.preventDefault();
        if (!checkFormErrors()) {
            submitForm();
        }
    }}>
        <input className={styles['form-edit-body']} type="text" value={newCommentInput} onChange={(event) => {
            formErrors.commentBody.checkValid(event.target.value);
            setNewCommentInput(event.target.value)
        }
        }
        ></input>
                    {formErrors.commentBody.error && <p className={styles['error-paragraph']}>Comment must be between 20 and 2000 chars</p>}

        <div><br />
            <input type="submit" value="Submit comment" /> </div>

    </form>

)

}
