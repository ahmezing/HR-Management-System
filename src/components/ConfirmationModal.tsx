import { Modal, Button, Text, Paper} from "@mantine/core";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const closeModal = () => {
    onClose();
  };

  const confirmAction = () => {
    onConfirm();
    closeModal();
  };

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Confirm" size="md">
      <Text component="h2" weight={500} size="xl" className="mb-2">
      </Text>
      <Paper className="mb-4">
        <Text component="p" size="md" color="black">
          Are you sure you want to perform this action?
        </Text>
      </Paper>
      <div className="flex justify-end">
        <Button
          className="bg-red-500 mr-2 hover:bg-red-600"
          onClick={confirmAction}
        >
          Confirm
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
