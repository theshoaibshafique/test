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
      <Card variant="outlined">
        <CardContent>
          <Typography color="textSecondary">
            {this.props.annotation.header}
          </Typography>
          <Typography color="textPrimary">
            {this.props.annotation.body}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}