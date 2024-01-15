import AddContactModal from "../modals/AddContactModal";
import CofirmationModal from "../modals/CofirmationModal";
import CreateJobModal from "../modals/CreateJobModal";
import EditContactModal from "../modals/EditContactModal";

//this component will be used to render all the modals
const ModalProvider = () => {
  return (
    <>
      <CofirmationModal />
      <AddContactModal />
      <CreateJobModal />
      <EditContactModal />
    </>
  );
};

export default ModalProvider;
