import { Modal, Button, Text, Paper } from "@mantine/core";

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
    <Modal opened={isOpen} onClose={closeModal} title="Confirmation" size="sm">
      <div className="p-6">
        <Text align="center" size="lg" weight={700} className="mb-4">
          Confirm Action
        </Text>
        <Paper shadow="sm" className="mb-4">
          <Text align="center" size="sm" color="gray">
            Are you sure you want to perform this action? This action cannot be undone.
          </Text>
        </Paper>
        <div className="flex justify-end">
          <Button
            className="bg-red-500 text-white hover:bg-red-600 mr-2"
            onClick={confirmAction}
          >
            Confirm
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
