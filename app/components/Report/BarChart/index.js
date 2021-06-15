import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BarChart from './BarChart';
import { makeSelectToken, makeSelectLogger } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(BarChart);