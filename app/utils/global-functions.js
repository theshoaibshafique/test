import axios from 'axios';
import moment from 'moment/moment';

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
        if (response.status == 204) {
          return response.text();
        }
        if ([200, 201, 202].indexOf(response.status) >= 0) {
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
    }).catch(error => {
      console.error(error)
      return error;
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
        if (response.status == 204) {
          return response.text();
        }
        if ([200, 201, 202].indexOf(response.status) >= 0) {
          return response.json();
        } else if (response.text.length) {
          if ([200, 201, 202, 204].indexOf(JSON.parse(response).statusCode) >= 0) {
            return response.json();
          }
        } else if ([409].indexOf(response.status) >= 0) {
          return { "conflict": response.json() };
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
          return { "conflict": JSON.parse(response) };
        } else {
          return 'error';
        }
      }
    }).catch(error => {
      console.log(error)
    })
}

function axiosFetch(url, fetchMethod, userToken, fetchBodyJSON, cancelToken) {
  if (!url) {
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

function axiosFetchWithCredentials(url, fetchMethod, userToken, fetchBodyJSON) {
  if (!url) {
    return;
  }
  return axios({
    method: fetchMethod,
    url: url,
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    data: JSON.stringify(fetchBodyJSON),
    mode: 'cors'
  });
}

function formatDateTime(date) {
  let newDate = moment(date);
  return newDate.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
}

function getName(searchList, key) {
  if (!key || !searchList) {
    return key;
  }
  let index = searchList.findIndex(item => item.value && `${item.value}`.toLowerCase() == `${key}`.toLowerCase());
  if (index >= 0) {
    return searchList[index].name;
  }
  return key;
}

function formatSecsToTime(seconds, toWords = false, short = false) {
  var hh = Math.floor(seconds / 3600);
  var mm = Math.floor((seconds - (hh * 3600)) / 60);
  var ss = seconds - (hh * 3600) - (mm * 60);

  if (!toWords)
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  else if (short)
    return `${formatWords(hh, 'hr',true)} ${formatWords(mm, 'min',true)} ${formatWords(ss, 'sec',true)}`
  else
    return `${formatWords(hh, 'hour')} ${formatWords(mm, 'minute')} ${formatWords(ss, 'second')}`;
}

function formatWords(value, word, short = false) {
  if (value == 0 || parseInt(value) != value){
    return ""
  } else if (short){
    return `${value}${word}`
  }
  return `${(value > 0) ? `${value}${word}${(value > 1) ? `s` : ''}` : ''}`
}

function pad(string) {
  return ('0' + string).slice(-2)
}

//n = starting number
//m = end number (non inclusive)
//size = total string length
//d = padding character
function generatePaddedDigits(n, m, size, d) {
  var result = [];
  for (var i = n; i < m; i++) {
    var digit = i.toString().padStart(size, d);
    result.push(digit)
  }
  return result;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default {
  genericFetch,
  genericFetchWithNoReturnMessage,
  axiosFetch,
  formatSecsToTime,
  axiosFetchWithCredentials,
  formatDateTime,
  getName,
  generatePaddedDigits,
  toTitleCase
};