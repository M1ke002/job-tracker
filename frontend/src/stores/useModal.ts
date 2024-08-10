import ApplicationStage from "@/types/ApplicationStage";
import Contact from "@/types/Contact";
import DocumentType from "@/types/DocumentType";
import SavedJob from "@/types/SavedJob";
import ScrapedSiteSettings from "@/types/ScrapedSiteSettings";
import Task from "@/types/Task";
import { create } from "zustand";

export type ModalType =
  | "deleteJob"
  | "createJob"
  | "editJob"
  | "createApplicationStage"
  | "editApplicationStage"
  | "deleteApplicationStage"
  | "createApplicationStatus"
  | "editApplicationStatus"
  | "deleteApplicationStatus"
  | "createTask"
  | "editTask"
  | "deleteTask"
  | "createNote"
  | "editNote"
  | "deleteNote"
  | "createContact"
  | "editContact"
  | "deleteContact"
  | "deleteNotification"
  | "addJobToStage"
  | "editJobAlertSetting"
  | "uploadDocument"
  | "deleteDocument"
  | "editDocument"
  | "removeDocument"
  | "linkDocument";

interface ModalData {
  confirmModalTitle?: string;
  confirmModalMessage?: string;
  confirmModalConfirmButtonText?: string;
  confirmModalAction?: () => void;
  jobId?: string;
  contact?: Contact;
  alertSetting?: ScrapedSiteSettings;
  websiteName?: string;
  task?: Task;
  stageId?: string;
  setApplicationStageColumns?: React.Dispatch<
    React.SetStateAction<ApplicationStage[]>
  >;
  documentType?: string;
  documentId?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void; //the input data is optional ('?' symbol)
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data = {}) => set({ type, isOpen: true, data }), //default value for data is empty object if not provided
  onClose: () => set({ type: null, isOpen: false }),
}));
