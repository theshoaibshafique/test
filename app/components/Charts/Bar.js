import React from 'react';
// module is used to avoid React anti pattern -> using indexes as keys
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { axisLabelStyle, axisStyles } from './styles';
import { useTooltipContext, CustomTooltip } from "./CustomBarTooltip";
const equalProps = (props, prevProps) => prevProps === props;

const NoDataOverlay = (props) => (
  <div style={{
    position: 'absolute', top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#828282', width: '100%', height: '100%'
  }} className='header-1 flex vertical-center'>No Data</div>
)
const CustomTooltipContent = ({ payload, binSize, unit, value, customTooltipLine }) => {

  if (payload) {
    const { count, bin, fcotsCount, otsCount } = payload;
    const hasSecondEntry = Array.isArray(value)
    let body = null;
    //Default operation if COUNT is present
    if (count !== undefined) {
      body = (
        <>
          <div>Range: <span className='bold'>{`${bin} to ${bin + binSize} ${unit ?? 'min'}`}</span></div>
          <div>Frequency: <span className='bold'>{count}</span></div>
          {bin === 0 && customTooltipLine ? customTooltipLine : ''}
        </>
      )
    } else if (otsCount !== undefined) {
      body = (
        <>
          <div>Range: <span className='bold'>{`${bin} to ${bin + binSize} ${unit ?? 'min'}`}</span></div>
          <div>Case Frequency: <span className='bold'>{`${otsCount + fcotsCount}`}</span></div>
          {hasSecondEntry && <div>First Case Frequency: <span className='bold'>{`${fcotsCount}`}</span></div>}
        </>
      )
    }
    return (
      <div
        style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
      >
        {body}
      </div>
    );
  }
  return null;
};

/*
* This now generates a Histogram Bar graph - where the bars are in between tick marks
*
* @param {Array<object>} data - The data the chart is expecting to render
* @param {object} xAxisLabel - The x axis label data, to be used for the chart
* @param {object} yAxisLabel - The y axis label data, to be used for the chart
* @param {(number|string)} height - The height of the chart
* @param {Array<number>} interval - The tick interval of the chart
* @param {Array<string>} colors - The colors to be used for the chart
* @param {object} rest - Any additional props to be passed into the component
*/
const BarGraph = React.memo(({
  data, xAxisLabel, yAxisLabel, height, interval, colors, binSize, unit, threshold, customTooltipLine, ...rest
}) => {
  const hasData = data?.length;
  data = hasData ? data : [{ room: '' }]
  const { openTooltip, closeTooltip } = useTooltipContext() ?? {};
  // Default Tooltip overrides don't position Tooltip over the bars themselves now that we shifted to histograms
  const barProps = {
    onMouseEnter: e => (
      openTooltip?.({
        content: <CustomTooltipContent {...e} binSize={binSize} unit={unit} customTooltipLine={customTooltipLine} />,
      })
    ),
    onMouseLeave: () => closeTooltip?.()
  }
  const lastEl = data?.[data?.length - 1];
  return (
    <div style={{ position: 'relative' }} >
      <ResponsiveContainer width="100%" height={height} className='bar-chart'>
        <BarChart
          //Add one final bar to pad the ends
          data={hasData ? [...data, { bin: lastEl?.bin + binSize }] : data}
          {...rest}
        >
          {rest?.tripleColour && (
            <Bar {...barProps} dataKey="count" fill={colors?.length === 1 ? colors?.toString() : colors?.map((color) => color)}>
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
              <Bar {...barProps} stackId="a" dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
                {data.map((entry) => (
                  <Cell key={uuidv4()} fill={(entry.bin > (threshold ?? 0)) ? '#FF7D7D' : '#009483'} />
                ))}
              </Bar>
              <Bar {...barProps} stackId="a" dataKey={rest?.secondaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
                {data.map((_) => (
                  <Cell key={uuidv4()} fill="#cdcdcd" />
                ))}
              </Bar>
            </React.Fragment>
          )}
          {rest?.dualColour && !rest?.stacked && (
            <Bar {...barProps} dataKey={rest?.primaryKey ?? 'count'} fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'}>
              {data.map((entry) => (
                <Cell key={uuidv4()} fill={entry.bin > (threshold ?? 0) ? '#FF7D7D' : '#009483'} />
              ))}
            </Bar>
          )}
          {rest?.singleColour && (
            <Bar {...barProps} dataKey="count" fill={colors?.length === 1 ? colors?.toString() : '#3Db3E3'} />
          )}
          <XAxis scale='linear' dataKey="bin" label={{ ...xAxisLabel, ...axisLabelStyle }} style={axisStyles} interval={interval} domain={[0, 'auto']} />
          <YAxis allowDecimals={false} label={{ ...yAxisLabel, ...axisLabelStyle }} style={axisStyles} padding={{top:10}} />
        </BarChart>
      </ResponsiveContainer>
      {!hasData && <NoDataOverlay />}
    </div>
  );
}, equalProps);

/*
  We wrap the bar with a tooltip so we can track cursor positions on top of the bars
*/
const TooltipBarGraph = React.memo(props => (
  <CustomTooltip>
    <BarGraph {...props} />
  </CustomTooltip>
), equalProps)

export default TooltipBarGraph;
