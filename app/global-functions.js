function getInsightData(api, tileName, oauth) {
    return fetch(api, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + oauth,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "facilityName": null,
            "procedureName": "All",
            "tileName": tileName,
            "startDate": "2019-03-01",
            "endDate": "2019-05-01",
            "requestBy": null
        })
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects
}

function getSurveyData(api, tileName, oauth) {
    return fetch(api, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + oauth,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "facilityName": null,
            "surveyName": "abc-123",
            "tileName": tileName,
            "startDate": "2019-03-01",
            "endDate": "2019-05-01",
            "requestBy": null
        })
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects
}

function customMinMax(value) {
    let newValue = Math.round(value);
    return (newValue < 1) ? 1 : newValue;
}

export default {getInsightData, getSurveyData, customMinMax};