import { connect } from 'react-redux';
import CultureSurvey from './CultureSurvey';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectPublishedSurveys } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  publishedSurveys: makeSelectPublishedSurveys()
});

export default connect(mapStateToProps, null)(CultureSurvey);