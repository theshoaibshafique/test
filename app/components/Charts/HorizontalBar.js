import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, Cell } from 'recharts';
import { axisStyles, axisLabelStyle } from './styles';
import globalFunctions from '../../utils/global-functions';
import { LightTooltip } from '../SharedComponents/SharedComponents';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// @TODO: Could colocate this / update the traditional bar graph to pass in the required props to be used for rendering this horizontal
const equalProps = (props, prevProps) => prevProps === props;

const NoDataOverlay = () => (
  <div
    style={
      {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#828282',
        width: '100%',
        height: '100%',
        pointerEvents:'none'
      }
    }
    className="header-1 flex vertical-center"
  >
    No Data
  </div>
);
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    if (payload?.length === 1) {
      const [{ payload: { Time } }] = payload;
      return (
        <div
          style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
        >
          {`${label}: `} <span className='bold'>{`${Time} min`}</span>
        </div>
      )
    }
    return (
      <div
        style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
      >
        <div>{label}</div>
        {payload.map(({ color, name, payload }) => (
          <div className='subtle-subtext flex' style={{ marginBottom: 2 }} >
            <div style={{ backgroundColor: color, width: 16, height: 16 }} />
            <div style={{ marginLeft: 4 }}>
              {globalFunctions.toTitleCase(name)}:
              <span style={{ marginLeft: 2 }} className='bold'>{`${payload?.[name]} min`}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
/*
* @param {Array<object>} data - The data to be passed into the chart
* @param {object} xAxisLabel - The x axis label we want to display
* @param {object} yAxisLabel - The y axis label we want to display
* @param {(number|string)} height - The height of the chart
* @param {Array<string>} colors - The colors we want to use for the bars of the chart
* @param {Array<string>} dataKeys - The keys to use for rendering the data, in a stack
* @param {object} rest - The rest of the props we want to include on the chart
*/
const HorizontalBar = React.memo(({
  data, xAxisLabel, yAxisLabel, height, colors, dataKeys, legendTooltip, ...rest
}) => {
  const hasData = data?.length;
  data = hasData ? data : [{ room: '' }]
  return (
    <div style={{ position: 'relative' }} className='horizontal-bar'>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          layout="vertical"
          data={data}
          barGap='10'
          {...rest}
        >

          <Tooltip cursor={{ fill: '#fff' }} formatter={(value, name, props) => [`${value} min`, name]} content={<CustomTooltip />} />
          {rest?.legend && (
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                top: -20,
                left: -180,
                position: 'absolute'
              }}
              formatter={(value, entry, index) =>
              (
                <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>
                  {entry.dataKey.replace(/^\w{1}/, ($1) => $1.toUpperCase())} 
                  {legendTooltip?.[entry.dataKey] && <LightTooltip placement="top" fontSize="small" interactive arrow title={legendTooltip?.[entry.dataKey] ?? ''}>
                    <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 2px 2px ', color: '#8282828' }} className="log-mouseover" />
                  </LightTooltip>}
                </span>
              )
              }
            />
          )}
          {dataKeys?.map((dataKey, i) => (
            // colors is set by a preset list
            <Bar key={dataKey} dataKey={dataKey} stackId="a" fill={colors[i]} >
              {data.map((entry) => (
                <Cell key={uuidv4()} fillOpacity={entry.display ?? true ? 1 : .6} />
              ))}
            </Bar>
          ))}
          {/* Currently only used by Eff dashboard and Turnover which both use ROOM and Mins */}
          <YAxis tickFormatter={tickFormatter} interval={0} type="category" dataKey="room" label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} />
          <XAxis type="number" label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles} />

        </BarChart>
      </ResponsiveContainer>
      {!hasData && <NoDataOverlay />}
    </div>
  )
}, equalProps);

export default HorizontalBar;

const tickFormatter = (value, index) => {
  const limit = 6; // put your maximum character
  if (!value) return '';
  if (value.length < limit) return value;
  return `${value?.substring?.(0, limit)}...`;
};