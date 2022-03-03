import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { ChangeIcon, LightTooltip } from '../SharedComponents/SharedComponents';
import globalFunctions from '../../utils/global-functions';

const OvertimeCard = ({ data, reverse }) => {
  const { value, momentum, toolTip } = data ?? {}
  const { sum, annualized } = value ?? {};
  const [sumHr, sumMin, sumSec] = globalFunctions.formatSecsToTime(sum * 60)?.split(':');
  const [annHr, annMin, annSec] = globalFunctions.formatSecsToTime(annualized * 60)?.split(':');
  return (
    <React.Fragment>
      <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom:24 }}>
        <span>
          {data?.title}
          <LightTooltip placement="top" fontSize="small" interactive arrow title={toolTip?.toString()}>
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${toolTip?.toString()}`} />
          </LightTooltip>
        </span>

      </div>
      <div className="overtime-rows">
        <div className="flex" style={{ flex: '1 0 60%' }}>
          {parseInt(sumHr) > 0 && <div className="overtime-block-number">
            {sumHr || 0}
            <sub>hr</sub>
          </div>}
          <div className="overtime-block-number">
            {sumMin || 0}
            <sub>min</sub>
          </div>
        </div>
        <div className="overtime-helper subtext" style={{ flex: '1 0 20%' }}>
          in total
        </div>
      </div>
      <div  className="overtime-rows">
        <div className="flex" style={{ flex: '1 0 60%' }}>
          {parseInt(annHr) > 0 && <div className="overtime-block-number">
            {annHr || 0}
            <sub>hr</sub>
          </div>}
          <div className="overtime-block-number">
            {annMin || 0}
            <span >
              <sup ><ChangeIcon change={momentum} className='subtle-subtext' reverse={reverse} /></sup>
              <sub>min</sub>
            </span>
          </div>
        </div>
        <div className="overtime-helper subtext" style={{ flex: '1 0 20%' }}>
          annualized average per room
        </div>
      </div>
    </React.Fragment>
  )
};

export default OvertimeCard;
