import axios from 'axios';
import moment from 'moment/moment';

function genericFetch(api, fetchMethod, token, fetchBodyJSON) {
  const {userToken, roleToken} = typeof token == 'object' ? token : {userToken:token, roleToken:''};
  
  if (fetchMethod === 'get') {
    return fetch(api, {
      method: fetchMethod,
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json',
        'X-AUTH': roleToken
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
      return 'error';
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

function genericFetchWithNoReturnMessage(api, fetchMethod, token, fetchBodyJSON) {
  const {userToken, roleToken} = typeof token == 'object' ? token : {userToken:token, roleToken:''};
  return fetch(api, {
    method: fetchMethod,
    mode: 'cors',
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json',
      'X-AUTH':roleToken
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

function axiosFetch(url, fetchMethod, token, fetchBodyJSON, cancelToken) {
  if (!url) {
    return;
  }
  const {userToken, roleToken} = typeof token == 'object' ? token : {userToken:token, roleToken:''};
  return axios({
    method: fetchMethod,
    url: url,
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json',
      'X-AUTH':roleToken
    },
    data: JSON.stringify(fetchBodyJSON),
    mode: 'cors',
    cancelToken: cancelToken || new axios.CancelToken(function (cancel) {
    })
  });
}

function authFetch(url, fetchMethod, body) {
  if (!url) {
    return;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    params.append(key, value)
  }
  return axios({
    method: fetchMethod,
    url: url,
    mode: 'cors',
    data: params
  });
}

function axiosFetchWithCredentials(url, fetchMethod, token, fetchBodyJSON) {
  if (!url) {
    return;
  }
  const {userToken, roleToken} = typeof token == 'object' ? token : {userToken:token, roleToken:''};
  return axios({
    method: fetchMethod,
    url: url,
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json',
      'X-AUTH':roleToken
    },
    withCredentials: true,
    data: JSON.stringify(fetchBodyJSON),
    mode: 'cors'
  });
}
export async function getCdnStreamCookies(url,token) {
  const {userToken, roleToken} = typeof token == 'object' ? token : {userToken:token, roleToken:''};
  return axios({
    method: 'get',
    url: `${url}cookie`,
    headers: {
      'Authorization': 'Bearer ' + userToken,
      'X-AUTH':roleToken
    },
    withCredentials: true
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Cannot stream');
      }
    })
    .catch(err => {
      throw err;
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
  let index = searchList.findIndex(item => {
    item.value = item.value || item.id;
    return item.value && `${item.value}`.toLowerCase() == `${key}`.toLowerCase();
  });
  if (index >= 0) {
    return searchList[index].name || searchList[index].display;
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
    return `${formatWords(hh, 'hr', true)} ${formatWords(mm, 'min', true)} ${formatWords(ss, 'sec', true)}`
  else
    return `${formatWords(hh, 'hour')} ${formatWords(mm, 'minute')} ${formatWords(ss, 'second')}`;
}

function formatWords(value, word, short = false) {
  if (value == 0 || parseInt(value) != value) {
    return ""
  } else if (short) {
    return `${value} ${word}`
  }
  return `${(value > 0) ? `${value} ${word}${(value > 1) ? `s` : ''}` : ''}`
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
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
/*
  Generates list of integers from start to end using step size 'step'
*/
function range(start, end, step = 1) {
  if (start == end) {
    return [];
  }
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}
/*
  Adds the suffix to an integer (1 to 1st, 2 to 2nd, 3 to 3rd)
*/
function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
/*
  Returns difference of time since midnight (of that day)
*/
function getDiffFromMidnight(timeString, unit = 'hours') {
  return moment(timeString).diff(moment(timeString).startOf('day'), unit)
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function validEmail(email) {
  var EMAIL_REGEX = process.env.ALLOW_PLUS_EMAILS
    ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (EMAIL_REGEX.test(email)) {
    return (true);
  }
  return (false);
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
  toTitleCase,
  range,
  ordinal_suffix_of,
  getDiffFromMidnight,
  getWindowDimensions,
  authFetch,
  validEmail
};