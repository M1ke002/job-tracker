import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { useModal } from "@/stores/useModal";

const CofirmationModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const {
    confirmModalTitle,
    confirmModalMessage,
    confirmModalAction,
    confirmModalConfirmButtonText,
  } = data;

  const isModalOpen =
    isOpen &&
    (type === "deleteJob" ||
      type === "deleteTask" ||
      type === "deleteContact" ||
      type === "deleteNote" ||
      type === "deleteApplicationStage" ||
      type === "deleteNotification" ||
      type === "deleteDocument" ||
      type === "removeDocument");

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {confirmModalTitle}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 text-zinc-500">
          {confirmModalMessage}
        </DialogDescription>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center ml-auto">
            <Button
              variant="ghost"
              className="mr-2 hover:text-zinc-500"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="text-white bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (confirmModalAction) {
                  confirmModalAction();
                }
                handleCloseModal();
              }}
            >
              {confirmModalConfirmButtonText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CofirmationModal;
