import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ItemList from './ItemList';
import { makeSelectLogger, makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken(),
  logger: makeSelectLogger()
});

export default connect(mapStateToProps, null)(ItemList);