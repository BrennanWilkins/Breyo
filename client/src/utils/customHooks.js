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

export const useModalPos = (show, ref) => {
  return useEffect(() => {
    const updatePos = () => {
      ref.current.style.right = 'auto';
      let rect = ref.current.getBoundingClientRect();
      if (rect.right + 5 >= window.innerWidth) {
        ref.current.style.right = '5px';
      } else { ref.current.style.right = 'auto'; }
    };
    updatePos();
    if (show) { window.addEventListener('resize', updatePos); }
    return () => window.removeEventListener('resize', updatePos);
  }, [show]);
};
