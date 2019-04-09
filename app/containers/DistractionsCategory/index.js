import { connect } from 'react-redux';
import DistractionsCategory from './DistractionsCategory';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectProcedures } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  procedures: makeSelectProcedures()
});

export default connect(mapStateToProps, null)(DistractionsCategory);