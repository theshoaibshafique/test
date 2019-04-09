import React from 'react';
import { Link } from 'react-router-dom';
import SSTLogo from './img/SST_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.scss';
import Grid from '@material-ui/core/Grid';

class SSTHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header className="row margin0" style={{margin: '0px'}}>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Link to="/dashboard">
              <img src={SSTLogo} alt="OR BlackBox" />
            </Link>
          </Grid>
          <Grid item xs={6} className="flex right-center menu-column">
            <Link to="/user-manager">
              <FontAwesomeIcon className="SST-Menu" icon="cog" color="#004f6e" size="2x" />
            </Link>
          </Grid>
        </Grid>
      </header>
    );
  }
}

export default SSTHeader;