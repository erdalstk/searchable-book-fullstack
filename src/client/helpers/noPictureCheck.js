import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from '../config';

export const noPictureAddDefaultSrc = e => {
  e.target.src = STATIC_IMAGE_URL + NO_COVER_IMAGE;
};
