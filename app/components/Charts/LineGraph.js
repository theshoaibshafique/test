import React from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { axisLabelStyle, axisStyles } from './styles';

const equalProps = (props, prevProps) => props === prevProps;

/*
* @TODO: Possibly move this to a new component if a universal tooltip design can be decided on. Also, decide on colours / format
*/
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const [{ payload: { date, percentage } }] = payload;
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column', flexWrap: 'column wrap', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 4
        }}
      >
        <div>Date: {moment(date).format('MMM D YYYY')}&nbsp;</div>
        <div>Percentage: {percentage}</div>
      </div>
    );
  }
  return null;
};

/*
 * @param {Array<object>} data - The data the line graph is expecting to render
 * @param {object} xAxisLabel - An object representing the x axis label
 * @param {object} yAxisLabel - An object representing the y axis label
 * @param {Array<number>} interval - The tick interval of the chart
 * @param {number} xTickSize - The size each tick is expecting to be
 * @param {(number|object)} xTickMargin - The margin around the chart (defaulting currently to all margins)
 */
const LineGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, interval, xTickSize, xTickMargin
}) => {
  const formatTick = (item) => moment(item).format('MMM');
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
      >
        <XAxis dataKey="date" label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles} interval={interval} tickSize={xTickSize} tickMargin={xTickMargin} tickFormatter={formatTick} />
        <YAxis dataKey="percentage" label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} />
        <Line type="monotone" dataKey="percentage" stroke="#028CC8" dot={false} />
        <Line type="monotone" dataKey="network" stroke="#e0e0e0" dot={false} />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
}, equalProps);

export default LineGraph;
