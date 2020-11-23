import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';
import { makeSelectIsPresenter, makeSelectToken } from '../../../App/selectors';
import { setEMMVideoTime, setEMMPresenterDialog, setEMMPresenterMode } from '../../../App/emm-actions';
import { selectEMMPresenterMode, selectEMMReportData, selectEMMVidoeTime } from '../../../App/emm-selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  emmVideoTime: selectEMMVidoeTime(),
  emmPresenterMode: selectEMMPresenterMode(),
  hasPresenterRole: makeSelectIsPresenter(),
  emmReportData: selectEMMReportData(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEMMVideoTime: (videoTime) => { dispatch(setEMMVideoTime(videoTime)) },
    setEMMPresenterMode: (presenterMode) => { dispatch(setEMMPresenterMode(presenterMode)) },
    setEMMPresenterDialog: (presenterDialog) => { dispatch(setEMMPresenterDialog(presenterDialog)) }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPhaseVideoContainer);