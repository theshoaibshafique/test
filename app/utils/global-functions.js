function formatSecsToTime (seconds) {
  var hh   = Math.floor(seconds / 3600);
  var mm = Math.floor((seconds - (hh * 3600)) / 60);
  var ss = seconds - (hh * 3600) - (mm * 60);

  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`
}

function formatTimeToSecs (time) {
  let timeSegments = time.split(':');
  switch (timeSegments.length) {
    case 3:
      return parseInt(timeSegments[0] * 3600) + parseInt(timeSegments[1] * 60) + parseInt(timeSegments[2]);
      break;
    case 2:
      return parseInt(timeSegments[0] * 60) + parseInt(timeSegments[1]);
      break;
    default:
      return parseInt(timeSegments[0]);
      break;
  }
}

function pad (string) {
  return ('0' + string).slice(-2)
}

function genericFetch(api, fetchMethod, userToken, fetchBodyJSON) {
  if (fetchMethod === 'get') {
    return fetch(api, {
      method: fetchMethod,
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
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
          return 'conflict';
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
      } else if ([409].indexOf(response.status) >= 0) {
        return 'conflict';
      } else {
        return 'error';
      }
    }
  }).catch(error => {
    console.log(error)
  })
}

function objectArraySort(myArray, key, key2) {
  myArray.sort((a, b) => {
    var keyA = a[key],
        keyB = b[key],
        key1A = a[key2],
        key1B = b[key2];

    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;

    if(key1A < key1B) return 1;
    if(key1A > key1B) return -1;

    return 0;
  });

  return myArray;
}

function nestedCopy(array) {
  return JSON.parse(JSON.stringify(array));
}

function findIndexFromList(list, key) {
  let foundIndex = null;
  list.forEach((listItem, index) => {
    if (listItem.name.toUpperCase() == key.toUpperCase()) {
      foundIndex = index;
    }
  })
  return foundIndex;
}

export default {
  formatSecsToTime,
  formatTimeToSecs,
  pad,
  genericFetch,
  genericFetchWithNoReturnMessage,
  objectArraySort,
  nestedCopy,
  findIndexFromList,
};