import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import EmmAnnotation from '../EmmAnnotation/EmmAnnotation';
import EmmNote from '../EmmNote/EmmNote';

export default class AnnotationGroup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    
  }
  renderAnnotation(annotation,index){
    let xs = this.props.annotationGroup.length > 1 ? 6 : 12
    switch (annotation.tileType) {
      case 'EmmAnnotation':
        return <Grid item xs={xs} key={annotation.tileType+index}><EmmAnnotation annotation={annotation} /></Grid>
      case 'EmmNote':
        return <Grid item xs={xs} key={annotation.tileType+index}><EmmNote annotation={annotation} /></Grid>
      default:
        break;
    }
  }
  render() {
    
    return (
      <Card variant="outlined" className="annotation-card">
        <Grid container spacing={0}>
          {this.props.annotationGroup.map((annotation, index) => (
            this.renderAnnotation(annotation,index)
          ))}
        </Grid>
      </Card>
    );
  }
}