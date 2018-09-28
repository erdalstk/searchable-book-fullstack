import { toast } from 'react-toastify';

const toastOptions = {
  INFO: {
    autoClose: 2000,
    type: toast.TYPE.INFO,
    hideProgressBar: true
  },
  ERROR: {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: true
  }
};

export default toastOptions;
