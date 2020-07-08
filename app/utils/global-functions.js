import axios from 'axios';

function genericFetch(api, fetchMethod, userToken, fetchBodyJSON) {
  if (fetchMethod === 'get') {
    return fetch(api, {
      method: fetchMethod,
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response) {
        if ([200, 201, 202, 204].indexOf(response.status) >= 0) {
          return response.json();
        } else if (response.text.length) {
            if ([200, 201, 202, 204].indexOf(JSON.parse(response).statusCode) >= 0) {
              return response.json();
            }
        } else if ([409].indexOf(response.status) >= 0) {
          return 'conflict';
        } else {
          return 'error';
        }
      }
    })
  } else {
    return fetch(api, {
      method: fetchMethod,
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fetchBodyJSON)
    }).then(response => {
      if (response) {
        if ([200, 201, 202, 204].indexOf(response.status) >= 0) {
          return response.json();
        } else if (response.text.length) {
            if ([200, 201, 202, 204].indexOf(JSON.parse(response).statusCode) >= 0) {
              return response.json();
            }
        } else if ([409].indexOf(response.status) >= 0) {
          return {"conflict":response.json()};
        } else {
          return 'error';
        }
      }
    })
  }
}

function genericFetchWithNoReturnMessage(api, fetchMethod, userToken, fetchBodyJSON) {
  return fetch(api, {
    method: fetchMethod,
    mode: 'cors',
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fetchBodyJSON)
  }).then(response => {
    return response.text()
  })
  .then(response => {
    if (response) {
      if ([200, 201, 202, 204].indexOf(response.status) >= 0 || [200, 201, 202, 204].indexOf(JSON.parse(response).statusCode) >= 0) {
        return JSON.parse(response);
      } else if ([409].indexOf(response.status) >= 0 || response === '"Email Exists"') {
        return {"conflict":JSON.parse(response)};
      } else {
        return 'error';
      }
    }
  }).catch(error => {
    console.log(error)
  })
}

function axiosFetch(url,fetchMethod,userToken, fetchBodyJSON,cancelToken) {
  if (!url){
    return;
  }
  return axios({
    method: fetchMethod,
    url: url,
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(fetchBodyJSON),
    mode: 'cors',
    cancelToken: cancelToken || new axios.CancelToken(function (cancel) {
    })
  });
}

function formatSecsToTime (seconds, toWords = false) {
  var hh = Math.floor(seconds / 3600);
  var mm = Math.floor((seconds - (hh * 3600)) / 60);
  var ss = seconds - (hh * 3600) - (mm * 60);

  if (!toWords) {
    if (parseInt(hh) == 0)
      return `${pad(mm)}:${pad(ss)}`;
    else
      return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }
  else
    return `${formatWords(hh, 'hour')} ${formatWords(mm, 'minute')} ${formatWords(ss, 'second')}`;
}

function formatWords(value, word) {
  return `${(value > 0) ? `${value} ${word}${(value > 1) ? `s` : ''}`  : '' }`
}

function pad (string) {
  return ('0' + string).slice(-2)
}

export default {
  genericFetch,
  genericFetchWithNoReturnMessage,
  axiosFetch,
  formatSecsToTime,
};