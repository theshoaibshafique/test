import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
      {rest?.dualColour && (
        <Bar dataKey="count" fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
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
), equalProps);


export default BarGraph;
