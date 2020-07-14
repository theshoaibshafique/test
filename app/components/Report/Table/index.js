import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Table from './Table';
import { makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(Table);