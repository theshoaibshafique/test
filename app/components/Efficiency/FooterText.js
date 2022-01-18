import React from 'react';

const FooterText = ({ days }) => (
  <div>
    <i>Based on <strong>{days} days</strong> with elective hours from your filter criteria <br />
ORs with no data available are excluded from the report
    </i>
  </div>
);
export default FooterText;
