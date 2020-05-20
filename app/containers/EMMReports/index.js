import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReports from './EMMReports';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications, makeSelectEMMReportData } from '../App/selectors';
import { hideEMMReport, setEMMReport } from '../App/actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications(),
  emmReportData: makeSelectEMMReportData()
});

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => { dispatch(goBack()); },
    hideEMMReport: () => { dispatch(hideEMMReport()); },
    setEMMReport: (data) => { dispatch(setEMMReport(data)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMReports);