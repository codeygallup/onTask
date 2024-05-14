const Modal = ({ modalMessage, buttonConfig }) => {
  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content text-center">
          <div className="modal-body">
            <p className="fs-4">{modalMessage}</p>
          </div>
          <div className="modal-footer">
         {buttonConfig.map((btnConfig, i) => (
             <button
             key={i}
             type="button"
             className={`btn ${btnConfig.className}`}
             onClick={btnConfig.onClick}
           >
             {btnConfig.label}
           </button>
         ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;