import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DeleteModal from './DeleteModal';
import { makeSelectToken } from '.../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(DeleteModal);