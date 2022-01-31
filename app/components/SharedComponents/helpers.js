import globalFunctions from '../../utils/global-functions';

export const helperFetch = async (url, fetchMethod, userToken, queryParams, errorCallback) => {
  url += queryParams;
  return globalFunctions.genericFetch(url, fetchMethod, userToken, {})
    .then((result) => {
      if (result?.conflict) {
        return result.conflict.then((message) => {
          errorCallback?.(message);
        });
      }
      return result;

    })
    .catch((error) => {
      errorCallback?.(error);
      console.log('oh no', error);
    });
};

export const updateUserFacility = async (queryParams, userToken, errorCallback) => helperFetch(process.env.USER_V2_API + 'facility', 'PUT', userToken, queryParams, errorCallback);
