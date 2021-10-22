import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseAnalysis from './EMMPhaseAnalysis';
import { selectEMMPhaseIndex } from '../../App/store/EMM/emm-selectors';
import { setEMMPhaseIndex } from '../../App/store/EMM/emm-actions';
import { makeSelectLogger } from '../../App/selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  emmPhaseIndex: selectEMMPhaseIndex(),
  logger: makeSelectLogger()
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEmmPhaseIndex: (data) => { dispatch(setEMMPhaseIndex(data)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMPhaseAnalysis);