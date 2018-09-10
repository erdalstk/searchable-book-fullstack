import { toast } from 'react-toastify';

export const infoToastOptions = {
  autoClose: 3000,
  type: toast.TYPE.INFO,
  hideProgressBar: true
};

export const errorToastOptions = {
  autoClose: 3000,
  type: toast.TYPE.ERROR,
  hideProgressBar: true
};
