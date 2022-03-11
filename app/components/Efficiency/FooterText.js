import React from 'react';
import globalFunctions from '../../utils/global-functions';

const FooterText = ({ days, facilityName, fcotsThreshold, otsThreshold, turnoverThreshold }) => {
  const format = (time) => {
    return time == 0 ? '0 min' : globalFunctions.formatSecsToTime(time ?? 0, true, true)
  }
  return (
    <div>
      {days >= 0 && days !== null && <i>Based on <strong>{days} days</strong> with elective hours from your filter criteria <br />
        ORs with no data available are excluded from the report
      </i>}
      {facilityName && !isNaN(fcotsThreshold) && (
        <div>
          <i>
            On-time start grace period for <strong>{facilityName}</strong> is <strong>{format(fcotsThreshold)}</strong> for first cases of block, and <strong>{format(otsThreshold)}</strong> for all other cases
          </i>
        </div>
      )}
      {facilityName && !isNaN(turnoverThreshold) && (
        <div>
          <i>
            Turnovers longer than <strong>{facilityName}</strong> cutoff threshold of <strong>{format(turnoverThreshold)}</strong> were ommited from analysis
          </i>
        </div>
      )}
    </div>
  )
};
export default FooterText;
