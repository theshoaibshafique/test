import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMOverview from './EMMOverview';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(EMMOverview);