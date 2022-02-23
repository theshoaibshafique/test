import React from 'react';
// module is used to avoid React anti pattern -> using indexes as keys
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Brush } from 'recharts';

const equalProps = (props, prevProps) => prevProps === props;
const Traveller = ({ x, y, height, ...props }) => {
  // console.log(props)
  return (
    <circle {...props} cx={x} cy={y + 4} height='1' fill='#004F6E' stroke='#004F6E' stroke-width="2" r="8" />
  )
}
/*
* @param {Array<object>} data - The data the chart is expecting to render
* @param {object} xAxisLabel - The x axis label data, to be used for the chart
* @param {object} yAxisLabel - The y axis label data, to be used for the chart
* @param {(number|string)} height - The height of the chart
* @param {Array<number>} interval - The tick interval of the chart
* @param {Array<string>} colors - The colors to be used for the chart
* @param {object} rest - Any additional props to be passed into the component
*/
const BarGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, height, interval, colors, ...rest
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className='bar-chart'>
      <BarChart
        data={data}
        {...rest}
      >
        <XAxis type="number" dataKey="bin" height={50} label={xAxisLabel} interval={interval} domain={[0, 'auto']} />
        <YAxis dataKey={rest?.primaryKey ?? "count"} label={yAxisLabel} />
        <Tooltip />
        <Brush dataKey="bin" height={8} traveller={<Traveller />} stroke="#BDBDBD" />
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
        {rest?.dualColour && rest?.stacked && (
          <React.Fragment>
            <Bar stackId="a" dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
              {data.map((entry) => (
                <Cell key={uuidv4()} fill={entry.bin > 0 ? '#FF7D7D' : '#009483'} />
              ))}
            </Bar>
            <Bar stackId="a" dataKey={rest?.secondaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
              {data.map((_) => (
                <Cell key={uuidv4()} fill="#cdcdcd" />
              ))}
            </Bar>
          </React.Fragment>
        )}
        {rest?.dualColour && (
          <Bar dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
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
  );
}, equalProps);


export default BarGraph;
