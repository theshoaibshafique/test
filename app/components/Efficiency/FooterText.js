import React from 'react';
import globalFunctions from '../../utils/global-functions';

const FooterText = ({ days, facilityName, fcotsThreshold, otsThreshold, turnoverThreshold }) => {
  const [hh, mm, ss] = globalFunctions.formatSecsToTime(turnoverThreshold ?? 0)?.split(':');
  return (
    <div>
      {days >= 0 && <i>Based on <strong>{days} days</strong> with elective hours from your filter criteria <br />
        ORs with no data available are excluded from the report
      </i>}
      {facilityName && !isNaN(fcotsThreshold) && (
        <div>
          <i>
            On-time start grace period for <strong>{facilityName}</strong> is <strong>{fcotsThreshold}</strong> min for first cases of block, and <strong>{otsThreshold}</strong> min for all other cases
          </i>
        </div>
      )}
      {facilityName && !isNaN(turnoverThreshold) && (
        <div>
          <i>
            Turnovers longer than <strong>{facilityName}</strong> cutoff threshold of <strong>{hh}</strong> hr <strong>{mm}</strong> min were ommited from analysis
          </i>
        </div>
      )}
    </div>
  )
};
export default FooterText;
