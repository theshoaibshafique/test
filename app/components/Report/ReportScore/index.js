import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReportScore from './ReportScore';
import { makeSelectLogger, makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(ReportScore);