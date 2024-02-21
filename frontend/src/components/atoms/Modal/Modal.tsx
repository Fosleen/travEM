// @ts-nocheck

import { Dispatch, SetStateAction, forwardRef } from "react";
import upload from "../../../assets/images/upload_image.svg";
import Button from "../Button";
import Input from "../Input";
import "./Modal.scss";

type ModalProps = {
  toggleDialog: () => void;
  onClick: () => void;
  modalInputValue: string;
  modalImageHeightValue?: string;
  modalImageWidthValue?: string;

  setModalInputValue: Dispatch<SetStateAction<string>>;
  setImageHeightValue?: Dispatch<SetStateAction<string>>;
  setImageWidthValue?: Dispatch<SetStateAction<string>>;
  isAddArticle?: boolean;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      toggleDialog,
      setModalInputValue,
      setImageHeightValue = {},
      setImageWidthValue = {},
      onClick,
      modalInputValue,
      modalImageHeightValue,
      modalImageWidthValue,
      isAddArticle,
    },
    ref
  ) => {
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

              {isAddArticle && (
                <div className="modal-input-container">
                  <Input
                    name="width"
                    placeholder="Unesi aspect ratio vrijednost za width"
                    label="Aspect ratio za width"
                    value={modalImageWidthValue}
                    onChange={(e) => {
                      if (setImageWidthValue) {
                        setImageWidthValue(e.target.value);
                      }
                    }}
                  />
                  <Input
                    name="height"
                    placeholder="Unesi aspect ratio vrijednost za height"
                    label="Aspect ratio za height"
                    value={modalImageHeightValue}
                    onChange={(e) => {
                      if (setImageHeightValue) {
                        setImageHeightValue(e.target.value);
                      }
                    }}
                  />
                </div>
              )}
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
