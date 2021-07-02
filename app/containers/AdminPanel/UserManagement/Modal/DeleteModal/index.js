import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DeleteModal from './DeleteModal';
import { makeSelectToken, makeSelectLogger } from '../../../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(DeleteModal);