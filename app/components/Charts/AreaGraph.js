import React from 'react';
import { AreaChart, Area, ReferenceLine, Tooltip, ResponsiveContainer, YAxis, XAxis } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;

const AreaGraph = React.memo(({ data, reference, topReference, CustomTooltip }) => (
  <ResponsiveContainer width="100%" height={165}>
    <AreaChart
      width={600}
      height={140}
      data={data}
      margin={{
        top: topReference ? 30 : 10,
        right: 30,
        left: 10,
        bottom: 0
      }}
    >
      {CustomTooltip && <Tooltip content={<CustomTooltip />} />}
      <XAxis scale='linear' dataKey='x' hide />
      <Area
        type="monotone"
        dataKey="y"
        stackId="1"
        stroke="#004F6E"
        fill="#EEFAFF"
      />
      {reference !== null && topReference ? (
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
          style={{ fontWeight: 'bold' }}
          label={{
            angle: -90, value: 'Sample Average', offset: 70, position: 'insideBottom', color: '#004f6e'
          }}
          label={({ viewBox }) => {
            const { cx, cy, x,y } = viewBox;
            return (
              <text color='#004f6e' x={x} y={cy} transform={`rotate(-90,${x},8)`} className='recharts-text recharts-label' textAnchor='middle'>
                <tspan x={x-75} dy={3}>Sample Average</tspan>
              </text>
            )
          }}
        />
      )}
      <YAxis dataKey='y' padding={{ top: 8 }} hide />
    </AreaChart>
  </ResponsiveContainer>
), equalProps);

export default AreaGraph;
