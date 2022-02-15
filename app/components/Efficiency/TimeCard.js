import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import Goal from './Goal';

const TimeCard = ({ data, suffix }) => (
  <React.Fragment>
    <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {data?.title}
      <LightTooltip placement="top" fontSize="small" interactive arrow title={data?.toolTip?.toString()}>
        <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
      </LightTooltip>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="display-number">
          {data?.value ?? "N/A"}
          {data?.value && <sup className="superscript-text">{suffix || '%'}</sup>}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: 24 }}>
        <Goal target={data.goal} goal={data.value} />
      </div>
    </div>
    <div className="additional-scores">
      <div className="additional-scores-title">Previous Period </div>
      <div className="additional-scores-value">{data?.previousPeriod ?? "N/A"}{data?.previousPeriod && (suffix || '%')}</div>
    </div>
    <div className="additional-scores">
      <div className="additional-scores-title">OR Black Box<sup>&reg;</sup> Network</div>
      <div className="additional-scores-value">{data?.network ?? "N/A"}{data?.network && (suffix || '%')}</div>
    </div>
  </React.Fragment>
);
export default TimeCard;
