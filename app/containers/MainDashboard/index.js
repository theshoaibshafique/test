import { connect } from 'react-redux';
import MainDashboard from './MainDashboard';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectMostRecentSurvey } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  mostRecentSurvey: makeSelectMostRecentSurvey()
});

export default connect(mapStateToProps, null)(MainDashboard);