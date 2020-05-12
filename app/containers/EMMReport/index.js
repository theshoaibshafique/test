import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import EMMReport from './EMMReport';
import { makeSelectToken, makeSelectSpecialties, makeSelectComplications } from '../App/selectors';

const mapStateToProps = (state, ownProps) => createStructuredSelector({ 
  userToken: makeSelectToken(),
  requestId: () => ownProps.match.params.requestid,
  specialties: makeSelectSpecialties(),
  complications: makeSelectComplications()
});

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => {
      dispatch(goBack());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EMMReport);