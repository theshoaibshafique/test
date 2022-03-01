import React from 'react';
// module is used to avoid React anti pattern -> using indexes as keys
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { axisLabelStyle, axisStyles } from './styles';

const equalProps = (props, prevProps) => prevProps === props;

const NoDataOverlay = (props) => (
  <div style={{
    position: 'absolute', top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color:'#828282', width:'100%', height:'100%'
  }} className='header-1 flex vertical-center'>No Data</div>
)
/*
* @param {Array<object>} data - The data the chart is expecting to render
* @param {object} xAxisLabel - The x axis label data, to be used for the chart
* @param {object} yAxisLabel - The y axis label data, to be used for the chart
* @param {(number|string)} height - The height of the chart
* @param {Array<number>} interval - The tick interval of the chart
* @param {Array<string>} colors - The colors to be used for the chart
* @param {object} rest - Any additional props to be passed into the component
*/
const BarGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, height, interval, colors, ...rest
}) => {
  const hasData = data?.length;
  data = hasData ? data : [{ room: '' }]
  return (
    <div style={{position:'relative'}}>
      <ResponsiveContainer width="100%" height={height} className='bar-chart'>
        <BarChart
          data={data}
          {...rest}
        >
          <XAxis type="number" dataKey="bin" label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles} padding={{ left: 40, right: 40 }} interval={interval} domain={[0, 'auto']} />
          <YAxis allowDecimals={false} dataKey={rest?.primaryKey ?? "count"} label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} />
          <Tooltip />
          {rest?.tripleColour && (
            <Bar dataKey="count" fill={colors?.length === 1 ? colors?.toString() : colors?.map((color) => color)}>
              {data.map((entry) => {
                if (entry.bin < 0) {
                  return (
                    <Cell key={uuidv4()} fill="#009483" />
                  );
                }
                if (entry.bin <= 10) {
                  return (
                    <Cell key={uuidv4()} fill="#FFB71B" />
                  );
                }
                return (
                  <Cell key={uuidv4()} fill="#FF7D7D" />
                );
              })}
            </Bar>
          )}
          {rest?.dualColour && rest?.stacked && (
            <React.Fragment>
              <Bar stackId="a" dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
                {data.map((entry) => (
                  <Cell key={uuidv4()} fill={entry.bin > 0 ? '#FF7D7D' : '#009483'} />
                ))}
              </Bar>
              <Bar stackId="a" dataKey={rest?.secondaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
                {data.map((_) => (
                  <Cell key={uuidv4()} fill="#cdcdcd" />
                ))}
              </Bar>
            </React.Fragment>
          )}
          {rest?.dualColour && (
            <Bar dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
              {data.map((entry) => (
                <Cell key={uuidv4()} fill={entry.bin > 0 ? '#FF7D7D' : '#009483'} />
              ))}
            </Bar>
          )}
          {rest?.singleColour && (
            <Bar dataKey="count" fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'} />
          )}
        </BarChart>
      </ResponsiveContainer>
      {!hasData && <NoDataOverlay />}
    </div>
  );
}, equalProps);


export default BarGraph;
