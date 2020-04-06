import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MultiVideo from './MultiVideo';
import { makeSelectToken } from '../../App/selectors';

const mapStateToProps = createStructuredSelector({
  userToken: makeSelectToken()
});

export default connect(mapStateToProps, null)(MultiVideo);