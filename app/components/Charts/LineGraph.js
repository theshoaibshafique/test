import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const equalProps = (props, prevProps) => props === prevProps;

const LineGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, start, end, interval, xTickSize, xTickMargin
}) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart
      data={data}
    >
      <XAxis dataKey="date" label={xAxisLabel} interval={interval} tickSize={xTickSize} tickMargin={xTickMargin} />
      <YAxis dataKey="percentage" label={yAxisLabel} />
      <Line type="monotone" dataKey="percentage" stroke="#028CC8" dot={false} />
      <Line type="monotone" dataKey="network" stroke="#e0e0e0" dot={false} />
    </LineChart>
  </ResponsiveContainer>
), equalProps);

export default LineGraph;
