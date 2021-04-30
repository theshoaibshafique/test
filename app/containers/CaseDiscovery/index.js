import { connect } from 'react-redux';
import CaseDiscovery from './CaseDiscovery';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectFirstName, makeSelectLastName } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
});

export default connect(mapStateToProps, null)(CaseDiscovery);