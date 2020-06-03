import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMOverview from './EMMOverview';
import { makeSelectToken, makeSelectEMMReportData, makeSelectSpecialties, makeSelectComplications } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportData: makeSelectEMMReportData(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
});

export default connect(mapStateToProps, null)(EMMOverview);