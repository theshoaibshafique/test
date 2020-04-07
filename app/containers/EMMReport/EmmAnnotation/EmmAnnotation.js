import React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';

export default class EmmAnnotation extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    
  }
  componentDidMount() {

  }
  render() {
    return (
      <Card variant="outlined" className="annotation-card">
        <CardContent>
          <Typography color="textSecondary" className="annotation-secondary">
            {this.props.annotation.header}
          </Typography>
          <Typography color="textPrimary" style={{fontWeight:'bold',margin:"8px 0"}}>
            {this.props.annotation.title}
          </Typography>
          <Typography color="textPrimary" variant="body1" component="div">
          {this.props.annotation.dataPoints.map((dataPoint, index) => (
            <Box key={dataPoint.title}>
            <span style={{fontWeight:'bold'}}>{dataPoint.title}: </span>{dataPoint.valueX}
            </Box>
          ))}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}