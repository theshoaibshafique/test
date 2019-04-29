function getInsightData(api, tileName, oauth, procedure = "All") {
    return fetch(api, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + oauth,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "facilityName": null,
            "procedureName": procedure,
            "tileName": tileName,
            "startDate": "2019-03-01",
            "endDate": "2019-05-01",
            "requestBy": null
        })
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects
}

function getSurveyData(api, tileName, oauth, surveyName) {
    return fetch(api, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + oauth,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "facilityName": null,
            "surveyName": surveyName,
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

function mapValuesToProperties(fullList, values, targetProperty) {
    let possibleValues = fullList.reduce(function(map, obj) {
        map[obj] = 0;
        return map;
    }, {});
    values.map((value) => {
        possibleValues[value.value] = value[targetProperty]
    });
    let formattedObject = Object.keys(possibleValues).map((key, index) => {
        return {'name': key, 'responses': possibleValues[key]};
    });

    return formattedObject;
}

export default {getInsightData, getSurveyData, customMinMax, mapValuesToProperties};