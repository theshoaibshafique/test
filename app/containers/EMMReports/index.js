import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReports from './EMMReports';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';
import { hideEMMReport } from '../App/actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => { dispatch(goBack()); },
    hideEMMReport: () => { dispatch(hideEMMReport()); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMReports);