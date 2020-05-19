import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BarChart from './BarChart';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(BarChart);