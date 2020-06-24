import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainLayout from './MainLayout';
import { makeSelectToken } from '../App/selectors';
import { selectEMMReportID } from '../App/emm-selectors';
import { setEMMPublishAccess } from '../App/emm-actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  emmReportID: selectEMMReportID()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEMMPublishAccess: (publishAccess) => { dispatch(setEMMPublishAccess(publishAccess)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);