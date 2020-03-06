import { connect } from 'react-redux';
import MainDashboard from './MainDashboard';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectFirstName, makeSelectLastName } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
});

export default connect(mapStateToProps, null)(MainDashboard);