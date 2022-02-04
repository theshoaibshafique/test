import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../SharedComponents/SharedComponents';

const OvertimeCard = ({ data }) => (
  <React.Fragment>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <h4 style={{ marginBottom: '32px' }}>
        { data?.title }
        <LightTooltip placement="top" fontSize="small" interactive arrow title={data?.toolTip?.toString()}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
        </LightTooltip>
      </h4>
    </div>
    <div className="overtime-rows">
      <div className="overtime-block-number">{data?.value?.sum || 0}
        <sub>min</sub>
      </div>
      <div className="overtime-helper" style={{ flex: '1 0 20%' }}>
          in total
      </div>
      <div className="overtime-block-number">{data?.value?.annualized || 0}
        <sub>min</sub>
      </div>
      <div className="overtime-helper">
          Annualized Average Per Room
      </div>
    </div>
  </React.Fragment>
);

export default OvertimeCard;
