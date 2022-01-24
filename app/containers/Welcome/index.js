import { connect } from 'react-redux';
import Welcome from './Welcome';

import { createStructuredSelector } from 'reselect';
import {
  makeSelectToken,
  makeSelectFirstName,
  makeSelectLastName,
  makeSelectFacility,
} from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
  facility: makeSelectFacility(),
});

export default connect(mapStateToProps, null)(Welcome);
