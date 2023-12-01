// ConfirmEdit.tsx
import { Modal, Button, useMantineTheme } from '@mantine/core';

interface ConfirmEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmEditModal({ isOpen, onClose, onConfirm }: ConfirmEditModalProps) {
  const theme = useMantineTheme();

  return (
    <Modal opened={isOpen} onClose={onClose}
      overlayProps={{
        color: theme.colors.blue[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <p>Are you sure you want to confirm changes?</p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem'
      }}>
        <Button onClick={onClose} style={{ backgroundColor: theme.colors.blue[9] }}>Cancel</Button>
        <Button onClick={onConfirm} style={{ backgroundColor: theme.colors.green[9] }}>Confirm</Button>
      </div>
    </Modal>
  );
}
