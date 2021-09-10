import React from 'react';
import moment from 'moment/moment';
import { IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import { formatCaseForLogs } from './misc/Utils';
import { useSelector } from 'react-redux';
import { makeSelectLogger } from '../App/selectors';
import { displayTags } from './misc/helper-components';
const MAX_SHORT_TAGS = 4;
export function Case(props) {
  const { procedures, emrCaseId, wheelsIn, wheelsOut, roomName, tags, onClick, isSaved, handleSaveCase, isShort } = props;
  const sTime = moment(wheelsIn).format("HH:mm");
  const eTime = moment(wheelsOut).format("HH:mm");
  const diff = moment().endOf('day').diff(moment(wheelsIn).endOf('day'), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const { specialtyName, procedureName } = procedures && procedures.length && procedures[0];
  const daysAgo = `${date} (${diff} ${diff == 1 ? 'day' : 'days'} ago)`;
  const tagDisplays = displayTags(tags, emrCaseId);

  const procedureList = [...new Set(procedures.slice(1).map((p) => p.procedureName))];
  const specialtyList = [...new Set(procedures.map((p) => p.specialtyName))];
  const logger = useSelector(makeSelectLogger());
  const handleClick = () => {
    onClick();
    logger.manualAddLog('click', `open-case-${emrCaseId}`, formatCaseForLogs(props))
  }

  return (
    <div className={`case ${isShort && 'short'}`} description={JSON.stringify(formatCaseForLogs(props))} key={emrCaseId} onClick={handleClick} >
      <div className="case-header">
        <div className="title" title={procedureName}>
          {procedureName}
        </div>
        <div >
          <IconButton
            className={`save-toggle ${!isSaved && 'not-saved'}  ${isShort && 'short-icon'}`} onClick={(e) => { e.stopPropagation(); handleSaveCase() }}
            style={{ marginTop: -6, marginBottom: -11 }} title={isSaved ? "Remove from saved cases" : "Save case"}>
            {isSaved ? <StarIcon style={{ color: '#EEDF58', fontSize: 29 }} /> : <StarBorderIcon style={{ color: '#828282', fontSize: 29 }} />}
          </IconButton>

        </div>
      </div>

      {procedureList.length > 0 && (
        <div className="description additional-procedure">
          {`Additional Procedure${procedureList.length == 1 ? '' : 's'}`}
          <LightTooltip arrow title={
            <div>
              <span>{`Additional Procedure${procedureList.length > 1 ? 's' : ''}`}</span>
              <ul style={{ margin: '4px 0px' }}>
                {procedureList.map((line, index) => { return <li key={index}>{line}</li> })}
              </ul>
            </div>
          }>
            <InfoOutlinedIcon className="log-mouseover" id={`additional-procedure-tooltip-${emrCaseId}`} description={JSON.stringify({ emrCaseId: emrCaseId, toolTip: procedureList })} style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
          </LightTooltip>
        </div>
      )
      }

      <div className="subtitle" title={specialtyList.join(" & ")}>
        {!isShort && <span>{roomName} • </span>}{specialtyList.join(" & ")}
      </div>
      <div className="description">
        {!isShort && <span>Case ID: {emrCaseId}</span>}
        <span title={daysAgo}>{daysAgo}</span>
        {!isShort && <span>{sTime} - {eTime}</span>}

      </div>
      {tagDisplays.length > 0 && <div className="tags">
        {isShort && tagDisplays.length > MAX_SHORT_TAGS ? (
          <span className="plus-text subtext">
            {tagDisplays.slice(0, MAX_SHORT_TAGS)}
            <span style={{ opacity: .8 }} >+{tagDisplays.length - MAX_SHORT_TAGS}</span>
          </span>
        ) : tagDisplays}
      </div>}
    </div>
  )
}

export function ThumbnailCase(props) {
  const { title, caseId, thumbnailSrc, toolTip, isSaved, handleSaveCase, onClick } = props;
  const logger = useSelector(makeSelectLogger());
  const handleClick = () => {
    onClick();
    logger.manualAddLog('click', `open-case-${caseId}`, formatCaseForLogs(props))
  }
  
  const tagDisplays = displayTags([{ tagName: 'Flagged', toolTip }], caseId);
  return (
    <div className="case short thumbnail-case"
      style={{background:`url(${thumbnailSrc})`}}
      description={JSON.stringify(formatCaseForLogs(props))}
      key={caseId}
      onClick={handleClick} >
      <div className="case-header">
        <div className="title" title={title} style={{color:"#fff"}}>
          {title}
        </div>
        <div >
          <IconButton
            className={`save-toggle ${!isSaved && 'not-saved'}  short-icon`} onClick={(e) => { e.stopPropagation(); handleSaveCase() }}
            style={{ marginTop: -6, marginBottom: -11 }} title={isSaved ? "Remove from saved cases" : "Save case"}>
            {isSaved ? <StarIcon style={{ color: '#EEDF58', fontSize: 29 }} /> : <StarBorderIcon style={{ color: '#828282', fontSize: 29 }} />}
          </IconButton>

        </div>
      </div>
      <div className="tags">
        {tagDisplays}
      </div>

    </div>
  )
}