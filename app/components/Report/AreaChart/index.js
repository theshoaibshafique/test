import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AreaChart from './AreaChart';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(AreaChart);