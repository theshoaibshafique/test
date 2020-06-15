import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMMPhaseVideoContainer from './EMMPhaseVideoContainer';
import { makeSelectToken } from '../../../App/selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(EMMPhaseVideoContainer);