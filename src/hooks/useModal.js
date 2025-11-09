import { useCallback, useState } from "react";

export const useModal = () => {
  const [visibilityModal, setVisibilityModal] = useState(false);

  const openModal = useCallback(() => {
    setVisibilityModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setVisibilityModal(false);
  }, []);
  return {
    visibilityModal,
    openModal,
    closeModal,
  };
};
