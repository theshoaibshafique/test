import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMOverview from './EMMOverview';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications, makeSelectLogger } from '../../App/selectors';
import { selectEMMReportData } from '../../App/store/EMM/emm-selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportData: selectEMMReportData(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(EMMOverview);