import { connect } from 'react-redux';
import CultureSurvey from './CultureSurvey';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
});

export default connect(mapStateToProps, null)(CultureSurvey);