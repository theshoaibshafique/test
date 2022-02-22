import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { axisStyles, axisLabelStyle } from './styles';

const equalProps = (props, prevProps) => prevProps === props;
// @TODO: Could colocate this / update the traditional bar graph to pass in the required props to be used for rendering this horizontal

/*
* @param {Array<object>} data - The data to be passed into the chart
* @param {object} xAxisLabel - The x axis label we want to display
* @param {object} yAxisLabel - The y axis label we want to display
* @param {(number|string)} height - The height of the chart
* @param {Array<string>} colors - The colors we want to use for the bars of the chart
* @param {Array<string>} dataKeys - The keys to use for rendering the data, in a stack
* @param {object} rest - The rest of the props we want to include on the chart
*/
const HorizontalBar = React.memo(({
  data, xAxisLabel, yAxisLabel, height, colors, dataKeys, ...rest
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart
      layout="vertical"
      data={data}
      barGap='10'
      {...rest}
    >
      {/* Currently only used by Eff dashboard and Turnover which both use ROOM and Mins */}
      <YAxis tickFormatter={tickFormatter} interval={0} type="category" dataKey="room" label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} />
      <XAxis type="number" label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles} />
      <Tooltip formatter={(value, name, props) => [`${value} min`, name]} />
      {rest?.legend && (
        <Legend
          verticalAlign="top"
          wrapperStyle={{
            top: -20,
            left: -210,
            position: 'absolute'
          }}
          formatter={(value, entry, index) =>
          (
            <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>{entry.dataKey.replace(/^\w{1}/, ($1) => $1.toUpperCase())}</span>
          )
          }
        />
      )}
      {dataKeys?.map((dataKey, i) => (
        <Bar key={dataKey} dataKey={dataKey} stackId="a" fill={colors[i]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
), equalProps);

export default HorizontalBar;

const tickFormatter = (value, index) => {
  const limit = 6; // put your maximum character
  if (!value) return '';
  if (value.length < limit) return value;
  return `${value?.substring?.(0, limit)}...`;
};