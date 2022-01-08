import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const BarGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, height, interval, colors, ...rest
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart
      data={data}
      {...rest}
    >
      <XAxis dataKey="bin" label={xAxisLabel} interval={interval} />
      <YAxis dataKey="count" label={yAxisLabel} />
      <Tooltip />
      <Bar dataKey="count" fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'} />
    </BarChart>
  </ResponsiveContainer>
), equalProps);


export default BarGraph;
