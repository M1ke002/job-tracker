import AddContactModal from "../modals/AddContactModal";
import CofirmationModal from "../modals/CofirmationModal";
import CreateJobModal from "../modals/CreateJobModal";

//this component will be used to render all the modals
const ModalProvider = () => {
  return (
    <>
      <CofirmationModal />
      <AddContactModal />
      <CreateJobModal />
    </>
  );
};

export default ModalProvider;
