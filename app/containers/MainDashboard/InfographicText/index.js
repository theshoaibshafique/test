import { connect } from 'react-redux';
import InfographicText from './InfographicText';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(InfographicText);