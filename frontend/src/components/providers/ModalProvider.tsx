import AddContactModal from "../modals/AddContactModal";
import AddJobToStageModal from "../modals/AddJobToStageModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import CreateJobModal from "../modals/CreateJobModal";
import CreateTaskModal from "../modals/CreateTaskModal";
import EditContactModal from "../modals/EditContactModal";
import EditDocumentModal from "../modals/EditDocumentModal";
import EditSavedJobModal from "../modals/EditSavedJobModal";
import EditTaskModal from "../modals/EditTaskModal";
import JobAlertSettingModal from "../modals/JobAlertSettingModal";
import LinkDocumentModal from "../modals/LinkDocumentModal";
import UploadDocumentModal from "../modals/UploadDocumentModal";

//this component will be used to render all the modals
const ModalProvider = () => {
  return (
    <>
      <ConfirmationModal />
      <AddContactModal />
      <EditContactModal />
      <CreateJobModal />
      <EditSavedJobModal />
      <AddJobToStageModal />
      <JobAlertSettingModal />
      <CreateTaskModal />
      <EditTaskModal />
      <UploadDocumentModal />
      <EditDocumentModal />
      <LinkDocumentModal />
    </>
  );
};

export default ModalProvider;
