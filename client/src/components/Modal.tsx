import type { ModalProps } from "../types";

const Modal = ({ modalMessage, buttonConfig }: ModalProps) => {
  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-xs"></div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="p-6 text-center">
            <p id="modal-title" className="text-xl whitespace-pre-line">
              {modalMessage}
            </p>
          </div>

          <div className="flex justify-center gap-3 border-t border-gray-200 p-4">
            {buttonConfig.map((btnConfig, i) => (
              <button
                key={i}
                type="button"
                className={`rounded-md border-2 border-slate-300 ${btnConfig.className}`}
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
