import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MyProfile from './MyProfile';
import { makeSelectToken, makeSelectFirstName, makeSelectLastName, makeSelectEmail, makeSelectJobTitle } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  firstName: makeSelectFirstName(),
  lastName: makeSelectLastName(),
  email: makeSelectEmail(),
  jobTitle: makeSelectJobTitle()
});

export default connect(mapStateToProps, null)(MyProfile);
