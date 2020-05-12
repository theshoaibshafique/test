import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BarChartDetail from './HorizantalBarChart';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(BarChartDetail);