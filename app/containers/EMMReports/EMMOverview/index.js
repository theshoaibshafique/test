import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMOverview from './EMMOverview';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications } from '../../App/selectors';
import { selectEMMReportData } from '../../App/emm-selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportData: selectEMMReportData(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
});

export default connect(mapStateToProps, null)(EMMOverview);