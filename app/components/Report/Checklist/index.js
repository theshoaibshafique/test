import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Checklist from './Checklist';
import { makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(Checklist);