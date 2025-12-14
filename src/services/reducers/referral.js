// USE_REFERRAL_CODE_REQUEST_ERROR

import {
  USE_REFERRAL_CODE_REQUEST,
  USE_REFERRAL_CODE_REQUEST_ERROR,
  USE_REFERRAL_CODE_REQUEST_SUCCESS,
} from "../actions/referral";

const initialState = {
  useReferralCodeRequest: false,
  useReferralCodeRequestError: false,
};

export const referralReducer = (state = initialState, action) => {
  switch (action.type) {
    case USE_REFERRAL_CODE_REQUEST:
      return {
        ...state,
        useReferralCodeRequest: true,
        useReferralCodeRequestError: false,
      };
    case USE_REFERRAL_CODE_REQUEST_ERROR:
      return {
        ...state,
        useReferralCodeRequest: false,
        useReferralCodeRequestError: true,
      };
    case USE_REFERRAL_CODE_REQUEST_SUCCESS:
      return {
        ...state,
        useReferralCodeRequest: false,
        useReferralCodeRequestError: false,
      };
    default:
      return state;
  }
};
