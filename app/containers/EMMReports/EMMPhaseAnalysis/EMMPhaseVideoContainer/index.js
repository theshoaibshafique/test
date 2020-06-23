import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';
import { makeSelectToken } from '../../../App/selectors';
import { setEMMVideoTime } from '../../../App/emm-actions';
import { selectEMMVidoeTime } from '../../../App/emm-selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken(),
  emmVideoTime: selectEMMVidoeTime()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEMMVideoTime: (videoTime) => { dispatch(setEMMVideoTime(videoTime)) }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPhaseVideoContainer);