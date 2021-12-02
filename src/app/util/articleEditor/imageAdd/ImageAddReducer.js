import * as imageUploadActions from './ImageAddActions';

const defaultState = {
  imageIsUploaded: false,
  uploadingImage: false,
  imageUrl: null
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case imageUploadActions.uploadImageRoutine.TRIGGER: {
      // const newState = state
      //   .set("imageIsUploaded", false)
      //   .set("uploadingImage", true);
      return { ...state, imageIsUploaded: false, uploadingImage: true };
    }
    case imageUploadActions.uploadImageRoutine.SUCCESS: {
      // const newState = state
      //   .set('imageIsUploaded', true)
      //   .set('uploadingImage', false)
      //   .set('imageUrl', payload.source_url);
      return {
        ...state,
        imageIsUploaded: true,
        uploadingImage: false,
        imageUrl: payload.source_url
      };
    }
    case imageUploadActions.uploadImageRoutine.FAILURE: {
      // const newState = state
      //   .set('imageIsUploaded', false)
      //   .set('uploadingImage', false);
      return { ...state, imageIsUploaded: false, uploadingImage: false };
    }

    default:
      return state;
  }
}
