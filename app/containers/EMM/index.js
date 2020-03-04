import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EMM from './EMM';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({ 
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid
});

export default connect(mapStateToProps, null)(EMM);