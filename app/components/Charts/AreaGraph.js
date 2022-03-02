import React from 'react';
import { AreaChart, Area, ReferenceLine, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const AreaGraph = React.memo(({ data, reference, topReference }) => (
  <ResponsiveContainer width="100%" height={165}>
    <AreaChart
      width={600}
      height={140}
      data={data}
      margin={{
        top: topReference ? 30 : 10,
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
      {reference && topReference ? (
        <ReferenceLine
          x={reference}
          stroke="#004f6e"
          label={{
            value: reference, offset: 10, position: 'top', color: '#004f6e', fontFamily: 'Noto Sans', fontSize: 26, fontWeight: 'bold'
          }}
        />
      ) : (
        <ReferenceLine
          x={reference}
          stroke="#004f6e"
          label={{
            angle: -90, value: 'Average', offset: 10, position: 'left', color: '#004f6e'
          }}
        />
      )}
      <YAxis padding={{top:8}}hide/>
    </AreaChart>
  </ResponsiveContainer>
), equalProps);

export default AreaGraph;
