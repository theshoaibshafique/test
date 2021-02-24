import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DonutChart from './DonutChart';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(DonutChart);