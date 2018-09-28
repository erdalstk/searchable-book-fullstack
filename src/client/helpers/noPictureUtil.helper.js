import { imageConstants } from '../config';

export const noPictureAddDefaultSrc = (e) => {
  e.target.src = imageConstants.STATIC_IMAGE_URL + imageConstants.NO_COVER_IMAGE;
};

export const noProfilePictureAddDefaultSrc = (e) => {
  e.target.src = imageConstants.STATIC_IMAGE_URL + imageConstants.NO_PROFILE_PICTURE_IMAGE;
};

const noPictureUtils = {
  noPictureAddDefaultSrc,
  noProfilePictureAddDefaultSrc
};

export default noPictureUtils;
