import React from 'react';
import globalFuncs from '../../../utils/global-functions';

const CaseInformation = (props) => {
  const { caseDuration, procedures, complications, allSpecialties, allComplications } = props;
  const caseProcedures = procedures.map((procedure) => {
    const foundSpecialty = allSpecialties.filter((specialty) => { return specialty.value.toUpperCase() == procedure.specialtyName.toUpperCase() })[0];
    if (foundSpecialty != undefined) {
      const foundProcedure = foundSpecialty.procedures.filter((specialty) => { return specialty.value.toUpperCase() == procedure.procedureName.toUpperCase() })[0];

      return {
        'specialty' : foundSpecialty.name,
        'procedure' : foundProcedure.name
      }
    } else {
      return {
        'specialty' : 'Unknown Specialty',
        'procedure' : 'Unknown Procedure'
      }
    }
  })
  const caseComplications = complications.map((complication) => {
    return allComplications.filter((allComplication) => {
      return allComplication.value.toUpperCase() == complication.toUpperCase() })[0]
  })

  return (
    <div className="Case-Information left-align">
      <div className="case-info-heading main-text">Duration</div>
      <div className="case-info-details">{globalFuncs.formatSecsToTime(caseDuration, true)}</div>
      <div className="case-info-heading main-text">Procedure</div>
      <div className="case-info-details">
      {
        caseProcedures.map((caseProcedure, index) => {
          return <div key={`caseProcedure${index}`} className="case-procedure-container">
                    <div className="case-info-details specialty">{caseProcedure.procedure}</div>
                    <div className="case-info-details procedure">({caseProcedure.specialty})</div>
                  </div>
        })
      }
      </div>
      <div className="case-info-heading main-text">Complications</div>
      <div className="case-info-details">
      {
        caseComplications.map((caseComplication, index) => {
          if (caseComplication == undefined) {
            return <div key={`caseComplication${index}`} className="case-complication">{complications[index]}</div>
          } else {
            return <div key={`caseComplication${index}`} className="case-complication">{caseComplication.name}</div>
          }
        })
      }
      </div>
    </div>
  )
}

export default CaseInformation;