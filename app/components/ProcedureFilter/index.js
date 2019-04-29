import { connect } from 'react-redux';
import ProcedureFilter from './ProcedureFilter';

import { createStructuredSelector } from 'reselect';
import { makeSelectProcedures } from '../../containers/App/selectors';

const mapStateToProps = createStructuredSelector({
  procedures: makeSelectProcedures()
});

export default connect(mapStateToProps, null)(ProcedureFilter);