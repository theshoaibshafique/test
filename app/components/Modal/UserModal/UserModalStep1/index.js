import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import UserModalStep1 from './UserModalStep1';
import { makeSelectToken } from '../../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(UserModalStep1);