import { toast } from "react-toastify";
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const useToast = () => {
  const success = (message, options = {}) =>
    toast.success(message, { ...defaultOptions, ...options });
  const errorFn = (message, options = {}) =>
    toast.error(message, { ...defaultOptions, ...options });
  const info = (message, options = {}) =>
    toast.info(message, { ...defaultOptions, ...options });
  const warning = (message, options = {}) =>
    toast.warning(message, { ...defaultOptions, ...options });

  return { success, errorFn, info, warning };
};

export default useToast;
