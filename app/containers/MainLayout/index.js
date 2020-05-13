import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectToken, makeSelectEMMReportID } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: makeSelectEMMReportID()
});

export default connect(mapStateToProps, null)(MainLayout);