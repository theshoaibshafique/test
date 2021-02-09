import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TimeSeriesChart from './TimeSeriesChart';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(TimeSeriesChart);