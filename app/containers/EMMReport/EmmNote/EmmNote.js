import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

export default class EmmNote extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    
  }
  render() {
    
    return (
        <CardContent>
          <Typography color="textSecondary" className="annotation-secondary">
            {this.props.annotation.header}
          </Typography>
          <Typography color="textPrimary" style={{marginTop:8}}>
            {this.props.annotation.body}
          </Typography>
        </CardContent>
    );
  }
}