import AddContactModal from "../modals/AddContactModal";
import AddJobToStageModal from "../modals/AddJobToStageModal";
import CofirmationModal from "../modals/CofirmationModal";
import CreateJobModal from "../modals/CreateJobModal";
import EditContactModal from "../modals/EditContactModal";
import EditSavedJobModal from "../modals/EditSavedJobModal";

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
    </>
  );
};

export default ModalProvider;
