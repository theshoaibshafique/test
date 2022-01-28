import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { PieChart, Pie, Label, Cell, Legend, ResponsiveContainer } from 'recharts';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';

const equalProps = (props, prevProps) => prevProps === props;

const Donut = React.memo(({ data, colours, tooltips, label }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
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
      <Legend width={250} height={250} layout="vertical" align="right" payload={data?.slice(1, data?.length)} formatter={(value, entry, index) => {
      if (tooltips.length < 2) {
        return (
          <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>
            {entry.name.replace(/^\w{1}/, ($1) => $1.toUpperCase())}
          </span>
        )
      }
      return (
      <React.Fragment>
        <span style={{ color: '#333', fontSize: 12, lineHeight: '16px' }}>{entry.name.replace(/^\w{1}/, ($1) => $1.toUpperCase())}</span>
        <LightTooltip
          placement="top"
          fontSize="small"
          interactive
          arrow
          title={tooltips[index]}
          style={{ color: '#333' }}
        >
          <InfoOutlinedIcon
            style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#828282' }}
            className="log-mouseover"
            id={`info-tooltip-${tooltips[index]?.toString().replace(/\b.,\b/g, '. ')}`}
          />
        </LightTooltip>
      </React.Fragment>
      )}}
      />
    </PieChart>
  </ResponsiveContainer>
  );
}, equalProps);

export default Donut;
