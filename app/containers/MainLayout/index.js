import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectToken, makeSelectEMMReportID } from '../App/selectors';
import { hideEMMReport } from '../App/actions';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: makeSelectEMMReportID()
});

const mapDispatchToProps = (dispatch) => {
  return {
    hideEMMReport: () => { dispatch(hideEMMReport()); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);