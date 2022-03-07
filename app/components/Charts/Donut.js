import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { PieChart, Pie, Label, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import globalFunctions from '../../utils/global-functions';

const equalProps = (props, prevProps) => prevProps === props;


const NoDataOverlay = (props) => (
  <div style={{
    position: 'absolute', 
    left:-20,
    color:'#828282', width:'100%', height:'100%'
  }} className='header-1 flex vertical-center'>No Data</div>
)

/*
 * @param {object} data - The data to be used by the chart
 * @param {(Array<objects>|Array<string>)} tooltips - The tooltips we want to use for each category in the legend
 * @param {string} label - The inner label of the chart
 */
const Donut = React.memo(({ data, tooltips, label, toTitleCase, CustomTooltip }) => {
  const hasData = data?.length;
  data = hasData ? data : [{ name: 'No Data 2', value: 100, color: '#BDBDBD' }, { name: 'No Data', value: 100, color: '#BDBDBD' }]
  label = hasData ? label : {...label, value: 'N/A', formattedValue: null}
  return (
    <ResponsiveContainer width="100%" height={250} className={hasData ? '' : 'donut-chart no-data'}>
      <PieChart>
        <Pie
          stroke=''
          data={data}
          cx={200}
          cy={120}
          innerRadius={95}
          outerRadius={120}
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`entry-${Math.floor(Math.random() * data.length)}`} fill={entry.color} />
          ))}
          <Label position="center" style={{ fontSize: 14, color: '#004F6E' }} content={<DonutLabel {...label} />} />
        </Pie>
        {hasData && <Tooltip content={<CustomTooltip toTitleCase={toTitleCase} />} />}
        {<Legend width={270} height={250} wrapperStyle={{ overflowY: 'auto' }} layout="vertical" align="right" payload={data}
          formatter={(_, entry, index) => {
            const { name } = entry ?? {};
            if (!hasData){
              return index === 0 ? <NoDataOverlay/> : ''
            }
            if (tooltips.length < 2) {
              return (
                <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>
                  {name.replace(/^\w{1}/, ($1) => $1.toUpperCase())}
                </span>
              )
            }
            return (
              <React.Fragment>
                <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>{name.replace(/^\w{1}/, ($1) => $1.toUpperCase())}</span>
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive
                  arrow
                  title={tooltips[name?.toUpperCase()]}
                  style={{ color: '#333' }}
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: 16, margin: '4px', color: '#828282' }}
                    className="log-mouseover"
                    id={`info-tooltip-${tooltips[index]?.toString().replace(/\b.,\b/g, '. ')}`}
                  />
                </LightTooltip>
              </React.Fragment>
            )
          }}
        />}
      </PieChart>
    </ResponsiveContainer>
  );
}, equalProps);

export default Donut;

function DonutLabel({ viewBox, title, value, formattedValue }) {
  const { cx, cy } = viewBox;
  return (
    <>
      <text x={cx} y={cy - 40} fill="#004F6E" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central" style={{fontFamily:'Noto Sans'}}>
        <tspan alignmentBaseline="middle" style={{ fontSize: 14, fill: '#333' }}>{title}</tspan>
        {/* Value is just a string/number */}
        {value !== undefined ? <tspan alignmentBaseline="bottom" x={cx} y={cy + 10} style={{ fontSize: 54, fill: '#004F6E', fontWeight: 'bold' }}>{value}</tspan> : ''}
      </text>
      {/* Value is an actual set of tspan */}
      {formattedValue && (
        <text x={cx} y={cy + 30} fill="#004F6E" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="bottom" style={{ fontSize: 54, color: '#004F6E', fontWeight: 'bold' }}>
          {formattedValue}
        </text>
      )}
    </>
  )
}