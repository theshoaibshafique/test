import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseAnalysis from './EMMPhaseAnalysis';
import { selectEMMPhaseIndex } from '../../App/emm-selectors';
import { setEMMPhaseIndex } from '../../App/emm-actions';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  emmPhaseIndex: selectEMMPhaseIndex()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEmmPhaseIndex: (data) => { dispatch(setEMMPhaseIndex(data)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPhaseAnalysis);