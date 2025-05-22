import { useState } from "react";
import axios from "axios";

function CommentCard({ comment, loggedInUser }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = () => {
    setIsDeleting(true);
    setDeleteError(null);

    axios
      .delete(
        `https://nc-news-api-f09o.onrender.com/api/comments/${comment.comment_id}`
      )
      .then(() => {
        setIsDeleted(true);
      })
      .catch(() => {
        setDeleteError("Failed to delete comment.");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  if (isDeleted)
    return (
      <p>
        <em>Comment deleted.</em>
      </p>
    );

  return (
    <div>
      <p>{comment.author} says:</p>
      <p>{comment.body}</p>
      <p>Votes: {comment.votes}</p>

      {loggedInUser === comment.author && (
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
    </div>
  );
}

export default CommentCard;
