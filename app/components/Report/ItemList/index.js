import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ItemList from './ItemList';
import { makeSelectToken } from '../../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(ItemList);