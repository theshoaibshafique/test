import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMOverview from './EMMOverview';
import { makeSelectToken, makeSelectEMMReportData } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportData: makeSelectEMMReportData()
});

export default connect(mapStateToProps, null)(EMMOverview);