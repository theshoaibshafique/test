import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DisplayNumber from './DisplayNumber';
import { makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(DisplayNumber);