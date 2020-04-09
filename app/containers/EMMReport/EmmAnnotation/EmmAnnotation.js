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
      <CardContent>
        <Typography color="textSecondary" className="annotation-secondary">
          {this.props.annotation.header}
        </Typography>
        <Typography color="textPrimary" className="annotation-title">
          {this.props.annotation.title}
        </Typography>
        <Typography color="textPrimary" variant="body1" component="div">
          {this.props.annotation.dataPoints.map((dataPoint, index) => (
            <Box key={dataPoint.title}>
              {dataPoint.title}: <span style={{ fontWeight: 'bold' }}>{dataPoint.valueX}</span>
            </Box>
          ))}
        </Typography>
      </CardContent>

    );
  }
}