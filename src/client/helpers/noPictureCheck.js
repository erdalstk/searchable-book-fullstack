import { STATIC_IMAGE_URL, NO_COVER_IMAGE, NO_PROFILE_PICTURE_IMAGE } from '../config';

export const noPictureAddDefaultSrc = e => {
  e.target.src = STATIC_IMAGE_URL + NO_COVER_IMAGE;
};

export const noProfilePictureAddDefaultSrc = e => {
  e.target.src = STATIC_IMAGE_URL + NO_PROFILE_PICTURE_IMAGE;
};
