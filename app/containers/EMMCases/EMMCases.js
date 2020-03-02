import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './style.scss';
import globalFuncs from '../../utils/global-functions';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <section>
        <div className="header">
          <p>Request for Enhanced M&M</p>
        </div>

        <div><p>Please fill in all the fields to submit a request for an Enhanced M&M.</p></div>
        
      </section>
    );
  }
}