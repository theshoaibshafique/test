import moment from 'moment/moment';

export function erf(x) {
    // constants
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    // Save the sign of x
    var sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

export function log_norm_cdf(duration, scale, shape) {
    let a = (Math.log(duration) - Math.log(scale)) / (Math.sqrt(2) * shape)
    return .5 + .5 * erf(a)
}

export function log_norm_pdf(duration, scale, shape) {
    let a = Math.exp(-((Math.log(duration) - Math.log(scale)) ** 2) / (2 * (shape ** 2)))
    return (1 / (duration * shape * Math.sqrt(2 * Math.PI))) * a
}



/*
  Generate random date between start/end time
*/
function momentRandom(end = moment(), start) {
    const endTime = +moment(end);
    const randomNumber = (to, from = 0) =>
        Math.floor(Math.random() * (to - from) + from);

    if (start) {
        const startTime = +moment(start);
        if (startTime > endTime) {
            throw new Error('End date is before start date!');
        }
        return moment(randomNumber(endTime, startTime));
    }
    return moment(randomNumber(endTime));
}

/*
Generate random case for Case Discovery search page
*/
function fakeCase() {
    var randomStart = momentRandom(moment(), moment().subtract(1, 'years'));
    var randomSpecialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
    var randomProcedure = PROCEDURES[Math.floor(Math.random() * PROCEDURES.length)];
    return {
        "procedures": [
            {
                "specialtyName": randomSpecialty.display,
                "procedureName": randomProcedure.display
            }
        ],
        "caseId": Math.floor(100000 + Math.random() * 900000),
        "startTime": randomStart.format(),
        "endTime": randomStart.add(Math.ceil(Math.random() * 12), 'hours').format(),
        "roomName": ORS[Math.floor(Math.random() * ORS.length)].display,
        "tags": TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3).map((tag) => {
            return { "title": tag, "description": "Hey this is a placeholder description. idk what to write here" }
        })
    }
}
/*
Generate list of random cases for Case Discovery search page
*/
function generateFakeCases(numCases) {
    return Array.from({ length: numCases }, () => fakeCase());
}

