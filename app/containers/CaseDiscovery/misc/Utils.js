import moment from 'moment/moment';

export function getPresetDates (option) {
  switch (option) {
    case 'Any Time':
      return { from: moment("2000-08-15"), to: moment('2122-04-04') }
    case 'Past week':
      return { from: moment().subtract(7, 'days'), to: moment() }
    case 'Past month':
      return { from: moment().subtract(1, 'months'), to: moment() }
    case 'Past year':
      return { from: moment().subtract(1, 'years'), to: moment() }
    default:
      return {}
  }
}

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
    The logs expect a different format for the case object
*/
export function formatCaseForLogs(c) {
  if (!c) {
    return {}
  }
  c = { ...c }
  const { procedures } = c;
  if (!procedures || !procedures.length) {
    return {}
  }
  c['primaryProcedure'] = procedures && procedures[0].procedureName
  c['primarySpecialty'] = procedures && procedures[0].specialtyName
  delete c['procedures']
  c['tags'] = c['tags'].map((t) => t.tagName);
  return c
}

export function getCasesInView() {

  const caseList = document.getElementsByClassName('case');
  if (!caseList || !caseList.length) {
    return 0
  }
  const inView = [];
  [...caseList].forEach(element => {
    if (isInViewport(element)) {
      inView.push(JSON.parse(element.getAttribute("description")))
    }
  });
  return inView;

}

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
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


/*** FLAG SUBMISSION HELPER FUNCTIONS ***/
export const getQuestionByLocation = (flagReport, flagReportLocation) => {
  if (flagReport && (flagReportLocation && flagReportLocation.length > 0)) {
    let path = '';
    for (let i = 0; i < flagReportLocation.length; i++) {
      if (i % 2 === 0) {
        path += `.questions.sort((a, b) => a.questionOrder - b.questionOrder)[${flagReportLocation[i]}]`;
      } else if (i % 2 !== 0) {
        path += `.options.sort((a, b) => a.optionOrder - b.optionOrder)[${flagReportLocation[i]}]`;
      }
    }
    // console.log('path', `report${path}`);
    // return question path.
    return eval(`flagReport${path}`);
  }
};

export const getQuestionCount = (flagReport, flagReportLocation) => {
  let path = '';
  for (let i = 0; i < flagReportLocation.length; i++) {
    // If we are at an even index and at the last element in the location array.
    if (i % 2 === 0 && i === flagReportLocation.length - 1) {
      // concat .questions to path.
      path += `.questions`;
    } else if (i % 2 === 0 && i !== flagReportLocation.length - 1) {
      path += `.questions[${flagReportLocation[i]}]`;
    } else if (i % 2 !== 0) {
      path += `.options[${flagReportLocation[i]}]`;
    }
  }
  // console.log(eval(`report${path}`));
  const questionArray = eval(`flagReport${path}`);
  if (questionArray) {
    return questionArray.length;
  }
};
