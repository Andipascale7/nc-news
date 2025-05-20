function CommentCard({ comment }) {
  return (
    <div>
      <p>{comment.author} says:</p>
      <p>{comment.body}</p>
      <p>Votes: {comment.votes}</p>
    </div>
  );
}
export default CommentCard