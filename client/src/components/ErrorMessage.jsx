import './ErrorMessage.css';

function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export default ErrorMessage;
