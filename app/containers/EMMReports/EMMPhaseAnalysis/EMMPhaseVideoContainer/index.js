import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';
import { makeSelectEMMPresenter, makeSelectLogger, makeSelectToken } from '../../../App/selectors';
import { setEMMVideoTime, setEMMPresenterDialog, setEMMPresenterMode } from '../../../App/store/EMM/emm-actions';
import { selectEMMPresenterMode, selectEMMReportData, selectEMMVidoeTime } from '../../../App/store/EMM/emm-selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  emmVideoTime: selectEMMVidoeTime(),
  emmPresenterMode: selectEMMPresenterMode(),
  hasPresenterRole: makeSelectEMMPresenter(),
  emmReportData: selectEMMReportData(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEMMVideoTime: (videoTime) => { dispatch(setEMMVideoTime(videoTime)) },
    setEMMPresenterMode: (presenterMode) => { dispatch(setEMMPresenterMode(presenterMode)) },
    setEMMPresenterDialog: (presenterDialog) => { dispatch(setEMMPresenterDialog(presenterDialog)) }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPhaseVideoContainer);