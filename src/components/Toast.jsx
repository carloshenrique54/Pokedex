function Toast({ message, type }) {
  return (
    <div className={`toast ${type}`}>
      <i className={`fa-solid ${type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-xmark" : "fa-circle-info"}`}></i>
      {message}
    </div>
  );
}

export default Toast;
