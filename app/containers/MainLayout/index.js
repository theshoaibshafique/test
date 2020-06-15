import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectToken } from '../App/selectors';
import { selectEMMReportID } from '../App/emm-selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: selectEMMReportID()
});

export default connect(mapStateToProps, null)(MainLayout);