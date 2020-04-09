import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import AnnotationGroup from './AnnotationGroup';
import { makeSelectToken } from '../App/selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({ 
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid
});

const mapDispatchToProps = (dispatch) => {
  return {
    pushUrl: (url) => {
      dispatch(push(url));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationGroup);