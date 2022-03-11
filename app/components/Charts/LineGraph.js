import React from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { axisLabelStyle, axisStyles } from './styles';

const equalProps = (props, prevProps) => props === prevProps;
const NoDataOverlay = (props) => (
  <div style={{
    position: 'absolute', top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#828282', width: '100%', height: '100%'
  }} className='header-1 flex vertical-center'>No Data</div>
)
/*
* @TODO: Possibly move this to a new component if a universal tooltip design can be decided on. Also, decide on colours / format
*/
const CustomTooltip = ({ active, payload, unitTitle }) => {
  if (active && payload?.length) {
    const [{ payload: { date, percentage } }] = payload;
    return (
      <div
        style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
      >
        <div>Date: <span className='bold'>{moment(date).format('MMM D YYYY')}</span></div>
        <div>{`${unitTitle ?? 'Percentage'}`}: <span className='bold'>{percentage}</span></div>
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
  data, xAxisLabel, yAxisLabel, interval, xTickSize, xTickMargin, areaReference, unitTitle
}) => {
  const formatTick = (item) => moment(item).format('MMM');
  const [start, end] = areaReference ?? []
  const hasData = data?.length;
  data = hasData ? data : [{ date: '' }]
  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={200} className='line-graph'>
        <LineChart
          data={data}
          margin={{bottom:12, right:24}}
        >
          <ReferenceArea x1={start} x2={end} fill="#B3CAD3" fillOpacity={.2} ifOverflow="extendDomain"/>
          <XAxis
            scale='linear'
            dataKey="date"
            label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles}
            interval={interval}
            tickSize={xTickSize}
            tickMargin={xTickMargin}
            tickFormatter={formatTick}
          />
          <YAxis dataKey="percentage" label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} padding={{top:10}}/>
          <Line type="monotone" dataKey="percentage" stroke="#028CC8" dot={false} />
          <Line type="monotone" dataKey="network" stroke="#e0e0e0" dot={false} />
          <Tooltip content={<CustomTooltip unitTitle={unitTitle} />} />

        </LineChart>
      </ResponsiveContainer>
      {!hasData && <NoDataOverlay />}
    </div>
  );
}, equalProps);

export default LineGraph;
