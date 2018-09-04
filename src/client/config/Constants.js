import { toast } from 'react-toastify';

export const STATIC_IMAGE_URL = '/static/upload/';
export const NO_COVER_IMAGE = 'no-cover.png';

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
