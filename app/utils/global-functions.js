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

export default {
  genericFetch,
  genericFetchWithNoReturnMessage
};