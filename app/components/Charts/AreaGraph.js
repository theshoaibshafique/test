import React from 'react';
import { AreaChart, Area, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const AreaGraph = React.memo(({ data, reference }) => (
  <ResponsiveContainer width="100%" height={165}>
    <AreaChart
      width={600}
      height={140}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <Tooltip />
      <Area
        type="monotone"
        dataKey="y"
        stackId="1"
        stroke="#004F6E"
        fill="#EEFAFF"
      />
      <ReferenceLine
        x={reference}
        stroke="#004f6e"
        label={{
          angle: -90, value: 'Average', offset: 10, position: 'left', color: '#004f6e'
        }}
      />
    </AreaChart>
  </ResponsiveContainer>
), equalProps);

export default AreaGraph;
