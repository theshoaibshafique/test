import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectLogger } from '../../../App/selectors';
import EMMPhaseEvents from './EMMPhaseEvents';

const mapStateToProps = createStructuredSelector({
    logger: makeSelectLogger()
  });
  
  export default connect(mapStateToProps, null)(EMMPhaseEvents);