import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AzureVideo from './AzureVideo';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(AzureVideo);