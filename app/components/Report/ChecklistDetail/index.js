import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ChecklistDetail from './ChecklistDetail';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(ChecklistDetail);