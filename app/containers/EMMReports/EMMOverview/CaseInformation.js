import React from 'react';
import globalFuncs from '../../../utils/global-functions';

const CaseInformation = (props) => {
  const { caseDuration, procedures, complications, allSpecialties, allComplications } = props;


  const caseComplications = complications.map((complication) => {
    return allComplications.filter((allComplication) => {
      return allComplication.value.toUpperCase() == complication.toUpperCase()
    })[0]
  })

  return (
    <div className="Case-Information left-align">
      <div className="case-info-details">
        {
          caseComplications.map((caseComplication, index) => {
            return
          })
        }
        <div className="case-complication">{
          caseComplications.map((caseComplication, index) => caseComplication == undefined ? complications[index] : caseComplication.name).join(' · ')
        }</div>
      </div>
    </div>
  )
}

export default CaseInformation;