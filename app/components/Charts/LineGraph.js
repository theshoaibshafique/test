import React from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const equalProps = (props, prevProps) => props === prevProps;

const LineGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, interval, xTickSize, xTickMargin
}) => {
  const formatTick = (item) => moment(item).format('MMM');
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
      >
        <XAxis dataKey="date" label={xAxisLabel} interval={interval} tickSize={xTickSize} tickMargin={xTickMargin} tickFormatter={formatTick} />
        <YAxis dataKey="percentage" label={yAxisLabel} />
        <Line type="monotone" dataKey="percentage" stroke="#028CC8" dot={false} />
        <Line type="monotone" dataKey="network" stroke="#e0e0e0" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}, equalProps);

export default LineGraph;
