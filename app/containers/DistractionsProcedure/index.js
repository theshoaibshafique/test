import { connect } from 'react-redux';
import DistractionsProcedure from './DistractionsProcedure';

import { createStructuredSelector } from 'reselect';
import { makeSelectToken, makeSelectProcedures } from '../App/selectors';

const mapStateToProps = createStructuredSelector({
  usertoken: makeSelectToken(),
  procedures: makeSelectProcedures()
});

export default connect(mapStateToProps, null)(DistractionsProcedure);