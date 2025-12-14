import { doRequest } from "../../utils/doRequest";

export const USE_REFERRAL_CODE_REQUEST = "USE_REFERRAL_CODE_REQUEST";
export const USE_REFERRAL_CODE_REQUEST_ERROR =
  "USE_REFERRAL_CODE_REQUEST_ERROR";
export const USE_REFERRAL_CODE_REQUEST_SUCCESS =
  "USE_REFERRAL_CODE_REQUEST_SUCCESS";

export function useReferralCode(
  referralData,
  increaseCompletedPage = () => {}
) {
  return function (dispatch) {
    dispatch({
      type: USE_REFERRAL_CODE_REQUEST,
    });

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(referralData),
    };

    doRequest("/referral", option)
      .then((data) => {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: data.user,
        });
        dispatch({
          type: SET_USER_ACCESS_TOKEN,
          access_token: data.access_token,
        });
        dispatch({
          type: SET_USER_DATA_IN_LOCAL_STORAGE,
          dataUser: data.user,
        });
        dispatch({
          type: USE_REFERRAL_CODE_REQUEST_SUCCESS,
        });
        increaseCompletedPage();
      })
      .catch(
        dispatch({
          type: USE_REFERRAL_CODE_REQUEST_ERROR,
        })
      );
  };
}
