import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { PieChart, Pie, Label, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';

const equalProps = (props, prevProps) => prevProps === props;

/*
* @TODO: Customize tool tip latr according to spacing, colours / no colours, etc.
*/
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const [{ name, value, payload: { payload: { color } } }] = payload;
    return (
      <div style={{ color: '#333', fontSize: 12, lineHeight: '16px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ display: 'flex', backgroundColor: color, width: 10, height: 10, position: 'absolute', top: 8, left: -10, paddingLeft: 15 }} />
        <span style={{ display: 'flex', marginLeft: 5 }}>{name.toUpperCase()}: {value}</span>
      </div>
    )
  }
  return null;
}

/*
 * @param {object} data - The data to be used by the chart
 * @param {(Array<objects>|Array<string>)} tooltips - The tooltips we want to use for each category in the legend
 * @param {string} label - The inner label of the chart
 */
const Donut = React.memo(({ data, tooltips, label }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          stroke=''
          data={data?.slice(1, data.length)}
          cx={200}
          cy={120}
          innerRadius={95}
          outerRadius={120}
          dataKey="value"
        >
          {data?.slice(1, data?.length).map((entry, index) => (
            <Cell key={`entry-${Math.floor(Math.random() * data.length)}`} fill={entry.color} />
          ))}
          <Label position="insideTop" style={{ fontSize: 14, color: '#004F6E' }} content={label} />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend width={270} height={250} wrapperStyle={{overflowY:'auto'}} layout="vertical" align="right" payload={data} formatter={(_, entry, index) => {
          const { name } = entry ?? {};
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
        />
      </PieChart>
    </ResponsiveContainer>
  );
}, equalProps);

export default Donut;
