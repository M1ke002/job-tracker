import AddContactModal from "../modals/AddContactModal";
import AddJobToStageModal from "../modals/AddJobToStageModal";
import CofirmationModal from "../modals/CofirmationModal";
import CreateJobModal from "../modals/CreateJobModal";
import CreateTaskModal from "../modals/CreateTaskModal";
import EditContactModal from "../modals/EditContactModal";
import EditDocumentModal from "../modals/EditDocumentModal";
import EditSavedJobModal from "../modals/EditSavedJobModal";
import EditTaskModal from "../modals/EditTaskModal";
import JobAlertSettingModal from "../modals/JobAlertSettingModal";
import UploadDocumentModal from "../modals/UploadDocumentModal";

//this component will be used to render all the modals
const ModalProvider = () => {
  return (
    <>
      <CofirmationModal />
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
    </>
  );
};

export default ModalProvider;
