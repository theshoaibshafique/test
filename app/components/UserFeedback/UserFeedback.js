import React, { useEffect, useReducer } from 'react';
import Icon from '@mdi/react';
import { mdiChevronUp, mdiChevronDown, mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import './style.scss';
import { Button, Checkbox, FormControlLabel, InputLabel, makeStyles, TextField } from '@material-ui/core';
import globalFunctions from '../../utils/global-functions';
import { makeSelectLogger, makeSelectToken } from '../../containers/App/selectors';
import { useSelector } from 'react-redux';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
const useStyles = makeStyles((theme) => ({
  inputLabel: {
    fontFamily: 'Noto Sans',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    color: '#323232',
    opacity: .8
  },
}));

const dataReducer = (state, event) => {
  const { logger } = state;
  for (const [key, value] of Object.entries(event)) {
    if (key == 'feedback' || key == 'sendEmail'){
      logger?.manualAddLog('onchange', key, value);
    }
  }
  
  return {
    ...state,
    ...event
  }
}
export function UserFeedback(props) {
  const logger = useSelector(makeSelectLogger());
  const [DATA, setData] = useReducer(dataReducer, {
    isOpen: false,
    feedback: "",
    sendEmail: false,
    isSending: false,
    isSent: false,
    logger: logger
  });
  const { isOpen, feedback, sendEmail, isSending, isSent } = DATA;
  const userToken = useSelector(makeSelectToken());

  const classes = useStyles();
  useEffect(() => {
    if (logger && !DATA.logger){
      setData({logger:logger})
    }
  }, [logger])

  const submit = () => {
    setData({ isSending: true });
    const jsonBody = {
      sendEmail: sendEmail,
      feedback: feedback
    }
    globalFunctions.genericFetch(`${process.env.USER_API}feedback`, 'post', userToken, jsonBody)
      .then(result => {

      }).catch((results) => {
        console.error("oh no", results)
      }).finally(() => {
        setData({ feedback: "", sendEmail: false, isSending: false, isSent: true })
      });
  }
  const handleOpen = (open) => {
    logger?.manualAddLog('click', 'toggle-user-feedback', { open: open });
    setData({ isOpen: open, isSent: false });
  }
  return (
    <div className={`user-feedback ${isOpen && 'open'} ${isSent && 'sent'}`} >
      <div className="title normal-text" onClick={() => handleOpen(!isOpen)}>
        <span>Feedback</span>
        <span><Icon color="#004F6E" path={isOpen ? mdiChevronDown : mdiChevronUp} size={'24px'} /></span>
      </div>
      <div className="feedback-form" >
        <div className="subtle-text">Send us any comments, feedback, suggestions, or problems you've encountered so we can fix them right away.</div>
        <InputLabel className={classes.inputLabel}>Message</InputLabel>
        <TextField
          multiline
          className="notes-field"
          rows="6"
          variant="outlined"
          size="small"
          fullWidth
          inputProps={{
            maxLength: 2000,
          }}
          value={feedback}
          onChange={(e) => setData({ feedback: e.target.value })}
        />

        <FormControlLabel
          control={
            <Checkbox
              disableRipple
              className="checkbox"
              icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
              checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
              checked={sendEmail} onChange={(e) => setData({ sendEmail: e.target.checked })} />
          }
          label={<span className="label" className={classes.inputLabel}>Send follow-up email</span>}
        />
        <Button variant="outlined" className="primary send-feedback"
          onClick={() => submit()}
          disabled={isSending || !feedback}
        >
          {isSending ? <div className="loader"></div> : 'Submit'}
        </Button>
      </div>
      <div className="feedback-submitted" hidden={!isSent}>
        <div className="img-container">
          <CheckCircleOutlineIcon style={{ fontSize: 54, color: 'green' }} />
        </div>
        <div className="message">Thank you for your feedback, it has been sent to our technical support team to investigate.</div>
        <div>
          <Button disableElevation disableRipple variant="contained" className="secondary close"
            onClick={() => handleOpen(false)}
          >
            Close
        </Button>
        </div>
      </div>
    </div>
  )
}