import { useEffect } from 'react';

export const useModalToggle = (show, ref, close) => {
  return useEffect(() => {
    const handleClick = e => {
      // close modal if user clicks outside of modal
      if (ref.current.contains(e.target)) { return; }
      close();
    };

    if (show) { document.addEventListener('mousedown', handleClick); }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show]);
};
