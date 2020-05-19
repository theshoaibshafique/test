import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ListDetailed from './ListDetailed';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(ListDetailed);