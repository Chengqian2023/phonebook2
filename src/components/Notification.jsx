const Notification = ({ message, error }) => {
  const notificationStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 20,
  };

  const errorStyle = {
    color: "red",
    fontSize: 15,
  };

  if (message === null && error === null) {
    return null;
  }

  if (message === null && error) {
    return (
      <div className="error" style={errorStyle}>
        {error}
      </div>
    );
  }
  if (message && error === null) {
    return (
      <div className="message" style={notificationStyle}>
        {message}
      </div>
    );
  }
};

export default Notification;
