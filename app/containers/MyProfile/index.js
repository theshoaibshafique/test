import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MyProfile from './MyProfile';
import { makeSelectToken, makeSelectFirstName, makeSelectLastName, makeSelectEmail, makeSelectJobTitle } from '../App/selectors';
import { setProfile } from '../App/actions';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
  email: makeSelectEmail(),
  jobTitle: makeSelectJobTitle(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setProfile: (profile) => {
      dispatch(setProfile(profile));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
