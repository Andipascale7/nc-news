import CommentCard from "./CommentCard";

function CommentsList({ comments }) {
  if (!comments) return <p>Loading comments, please wait...</p>;
  if (comments.length === 0) return <p>No comments yet.</p>;

  return (
    <section>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <CommentCard comment={comment} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CommentsList;
