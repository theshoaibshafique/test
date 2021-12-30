import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const BarGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, height, interval, ...rest
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart
      data={data}
      {...rest}
    >
      <XAxis dataKey="bin" label={xAxisLabel} interval={interval} />
      <YAxis dataKey="count" label={yAxisLabel} />
      <Tooltip />
      <Bar dataKey="count" fill="#3DB3E3" />
    </BarChart>
  </ResponsiveContainer>
), equalProps);


export default BarGraph;
