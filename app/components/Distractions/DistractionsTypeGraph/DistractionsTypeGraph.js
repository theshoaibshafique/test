import React from 'react';
import DistractionsGraphFilter from '../DistractionsGraphFilter';
import DistractionsGraphHeader from '../DistractionsGraphHeader';
import DistractionsGraphContent from '../DistractionsGraphContent';
import './style.scss';

class DistractionsTypeGraph extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {
    let stepWidth = 100 / (this.props.graphSteps.length - 1);

    let graphMax = this.props.graphSteps.reduce((prev, current) => (prev.y > current.y) ? prev : current)

    let GraphContent = this.props.graphPoints.map((graph, index) => {
      return <DistractionsGraphContent key={index} graphFilter={this.props.filter} caseNo={graph[0]} procedure={graph[1]} plotPoints={graph[2]} graphMax={graphMax} graphWidth={this.props.graphWidth} />
    });

    return (
      <div className="Distrations-Type-Graph-Wrapper">
        <div className="Distractions-Type-Graph">
          <DistractionsGraphFilter filter={this.props.filter} changeFilter={this.props.changeFilter} />
          <div className="flex">
            <div style={{width: this.props.graphWidth[0]}} ></div>
            <div style={{width: this.props.graphWidth[1]}} >
              <DistractionsGraphHeader steps={this.props.graphSteps} stepWidth={stepWidth} />
            </div>
          </div>
          {GraphContent}
        </div>
      </div>
    );
  }
}

export default DistractionsTypeGraph;
