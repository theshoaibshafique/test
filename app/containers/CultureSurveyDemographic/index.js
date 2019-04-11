import { connect } from 'react-redux';
import CultureSurveyDemographic from './CultureSurveyDemographic';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectPublishedSurveys } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  publishedSurveys: makeSelectPublishedSurveys()
});

export default connect(mapStateToProps, null)(CultureSurveyDemographic);