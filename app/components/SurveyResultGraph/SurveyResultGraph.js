import React from 'react';
import './style.scss';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

class SurveyResultGraph extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const dataArea = [
      {name: 'Disagree Strongly', responses: this.props.questionValue[0]},
      {name: 'Disagree', responses: this.props.questionValue[1]},
      {name: 'Neutral', responses: this.props.questionValue[2]},
      {name: 'Agree', responses: this.props.questionValue[3]},
      {name: 'Agree Strongly', responses: this.props.questionValue[4]},
    ]

    return (
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataArea}>
              <XAxis dataKey="name" interval={0} />
              <YAxis tick={false}/>
              <CartesianGrid vertical horizontal={false} />
              <Area dataKey="responses" stroke="#592d82" fill="#592d82" fillOpacity={1} />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={3} className="flex vertical-center">
          <div className="largest purple bold center-align">
            <span className="small">N/A</span><br />
            {this.props.questionValue[5]}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default SurveyResultGraph;
