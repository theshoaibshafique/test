import { connect } from 'react-redux';
import MainDashboard from './MainDashboard';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
});

export default connect(mapStateToProps, null)(MainDashboard);