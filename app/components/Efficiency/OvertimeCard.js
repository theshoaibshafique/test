import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { ChangeIcon, LightTooltip } from '../SharedComponents/SharedComponents';

const OvertimeCard = ({ data, reverse }) => (
  <React.Fragment>
    <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <span>
        {data?.title}
        <LightTooltip placement="top" fontSize="small" interactive arrow title={data?.toolTip?.toString()}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
        </LightTooltip>
      </span>

    </div>
    <div className="overtime-rows">
      <div className="overtime-block-number">{data?.value?.sum || 0}
        <sub>min</sub>
      </div>
      <div className="overtime-helper" style={{ flex: '1 0 20%' }}>
        in total
      </div>
      <div className="overtime-block-number">{data?.value?.annualized || 0}
        <span >
          <sup ><ChangeIcon change={data?.momentum} className='subtle-subtext' reverse={reverse} /></sup>
          <sub>min</sub>
        </span>
      </div>
      <div className="overtime-helper">
        Annualized Average Per Room
      </div>
    </div>
  </React.Fragment>
);

export default OvertimeCard;
