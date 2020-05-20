import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseAnalysis from './EMMPhaseAnalysis';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(EMMPhaseAnalysis);