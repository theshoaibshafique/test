import { connect } from 'react-redux';
import Welcome from './Welcome';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectFirstName, makeSelectLastName } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
});

export default connect(mapStateToProps, null)(Welcome);