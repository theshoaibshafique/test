import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const HorizontalBar = React.memo(({
  data, xAxisLabel, yAxisLabel, height, colors, dataKeys, ...rest
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart
      layout="vertical"
      data={data}
      {...rest}
    >
      <YAxis type="category" dataKey="room" label={yAxisLabel} />
      <XAxis type="number" label={xAxisLabel} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
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
