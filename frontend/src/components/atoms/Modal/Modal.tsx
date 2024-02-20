import { Dispatch, SetStateAction, forwardRef } from "react";
import upload from "../../../assets/images/upload_image.svg";
import Button from "../Button";
import Input from "../Input";
import "./Modal.scss";

type ModalProps = {
  toggleDialog: () => void;
  onClick: () => void;
  modalInputValue: string;
  setModalInputValue: Dispatch<SetStateAction<string>>;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ toggleDialog, setModalInputValue, onClick, modalInputValue }, ref) => {
    return (
      <>
        <dialog
          className="modal-container"
          ref={ref}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              toggleDialog();
            }
          }}
        >
          <div className="modal-inner-container">
            <img src={upload} alt="upload-image" className="modal-image" />
            <div className="modal-input-container">
              <Input
                name="image-url"
                placeholder="Unesi URL slike..."
                label="Dodaj sliku"
                value={modalInputValue}
                onChange={(e) => {
                  setModalInputValue(e.target.value);
                }}
              />

              <Input
                name="width"
                placeholder="Unesi širinu za aspect ratio slike"
                label="Unesi širinu"
                value={modalInputValue}
                onChange={(e) => {
                  setModalInputValue(e.target.value);
                }}
              />

              <Input
                name="height"
                placeholder="Unesi visinu za aspect ratio slike"
                label="Unesi visinu"
                value={modalInputValue}
                onChange={(e) => {
                  setModalInputValue(e.target.value);
                }}
              />
            </div>
            <div className="modal-buttons">
              <Button
                adminPrimary
                fitText={false}
                onClick={() => {
                  toggleDialog();
                  onClick();
                }}
              >
                Dodaj sliku
              </Button>
              <Button white fitText={false} onClick={toggleDialog}>
                Odustani
              </Button>
            </div>
          </div>
        </dialog>
      </>
    );
  }
);

export default Modal;
