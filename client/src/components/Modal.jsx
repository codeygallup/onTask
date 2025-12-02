const Modal = ({ modalMessage, buttonConfig }) => {
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-xs z-40"></div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 text-center">
            <p id="modal-title" className="text-xl">
              {modalMessage}
            </p>
          </div>

          <div className="flex gap-3 justify-center p-4 border-t border-gray-200">
            {buttonConfig.map((btnConfig, i) => (
              <button
                key={i}
                type="button"
                className={`border-2 border-slate-300 rounded-md ${btnConfig.className}`}
                onClick={btnConfig.onClick}
              >
                {btnConfig.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
