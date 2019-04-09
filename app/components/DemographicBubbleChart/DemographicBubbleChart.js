import React from 'react';
import './style.scss';
import BubbleChart from '@weknow/react-bubble-chart-d3';

class DemographicBubbleChart extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <BubbleChart
          graph= {{
            zoom: 0.8,
            offsetX: 0,
            offsetY: 0,
          }}
          width={600}
          height={500}
          showLegend={true} // optional value, pass false to disable the legend.
          legendPercentage={0} // number that represent the % of with that legend going to use.
          legendFont={{
                family: 'Arial',
                size: 12,
                color: '#000',
                weight: 'bold',
              }}
          valueFont={{
                family: 'Arial',
                size: 0,
                color: '#fff',
                weight: 'bold',
              }}
          labelFont={{
                size: 32,
                color: '#fff',
                weight: 'bold',
                display: 'none'
              }}
          //Custom bubble/legend click functions such as searching using the label, redirecting to other page
          // bubbleClickFunc={this.bubbleClick}
          // legendClickFun={this.legendClick}
          data={[
            { label: '1', value: 12, color: '#592d82' },
            { label: '2', value: 3, color: '#592d82' },
            { label: '3', value: 4, color: '#592d82' },
            { label: '4', value: 8, color: '#592d82' },
            { label: '5', value: 13, color: '#592d82' },
            { label: '6', value: 5, color: '#592d82' },
            { label: '7', value: 16, color: '#592d82' },
          ]}
        />

      </div>
    );
  }
}

export default DemographicBubbleChart;
