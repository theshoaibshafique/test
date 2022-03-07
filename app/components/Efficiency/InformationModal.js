import React from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { StyledTab, StyledTabs, TabPanel } from '../SharedComponents/SharedComponents';
import './informationModal.scss';
import useLocalStorage from '../../hooks/useLocalStorage';
import globalFunctions from '../../utils/global-functions';

const closeButtonStyles = makeStyles({
  item: {
    marginRight: '-2px',
    marginTop: '18px',
    textAlign: 'right',
    paddingRight: 20
  }
});

/*
* @param {boolean} open - Flag for determining if the modal is open
* @param {Function} onToggle - Function used to toggle the dashboard as open / closed
*/
const InformationModal = ({ open, onToggle }) => {
  const closeClass = closeButtonStyles();
  const [tab, setTab] = React.useState(0);
  const handleTabChange = React.useCallback((_, value) => {
    setTab(value);
  }, []);
  const { getItemFromStore } = useLocalStorage();
  const config = getItemFromStore('efficiencyV2')?.efficiency ?? {};
  const { facilityName, fcotsThreshold, otsThreshold, turnoverThreshold } = config;
  return (

    <Modal open={open} onClose={onToggle}>
      <DialogContent className="efficiency-content modal">
        <Grid container spacing={0} justify="center">
          <Grid item xs={10} className="title header-2">
            What is the Efficiency Dashboard?
          </Grid>
          <Grid item xs={2} className={closeClass.item}>
            <IconButton disableRipple disableFocusRipple onClick={onToggle} className="close"><CloseIcon fontSize="small" /></IconButton>
          </Grid>
          <Grid item xs={12} className="column">
            <Grid container spacing={0} direction="column">
              <Grid item xs className="paragraph subtext">
                This dashboard offers insights into the function of the operating room during block hours according to four main categories
              </Grid>
              <Grid item xs={12}>
                <div className="efficiencyOnBoard-segment">
                  <div className="subtitle bold subtext">
                    Segmenting the data:
                  </div>
                  <div>
                    Each category can be filtered according to time, operating room, and specialty as applicable. Trends over time can also be analyzed per category.
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <StyledTabs
              value={tab}
              onChange={(_, value) => handleTabChange(_, value)}
              indicatorColor="primary"
              textColor="primary"
              className="efficiency-tab"
              style={{ marginBottom: 24 }}
            >
              <StyledTab label="Case On-Time" />
              <StyledTab label="Turnover Time" />
              <StyledTab label="Block Utilization" />
              <StyledTab label="Case Scheduling" />
            </StyledTabs>
            <TabPanel value={tab} index={0} className="panel subtext">
              <div>
                <span className="bold " style={{ marginRight: 4, color: '#004F6E' }}>Case On-Time</span>
                {`provides analytics comparing the actual time that cases started to the time they were scheduled to start. 
                First cases of a block are considered to be on-time if they start earlier than the 
                ${facilityName} defined grace period of ${globalFunctions.formatSecsToTime(fcotsThreshold, true, true)} 
                after their scheduled start . All other cases are considered to be on-time if they start earlier than 
                ${facilityName} defined grace period of ${globalFunctions.formatSecsToTime(otsThreshold, true, true)} after their 
                scheduled start.`}
              </div>

            </TabPanel>
            <TabPanel value={tab} index={1} className="panel subtext">
              <span className="bold " style={{ marginRight: 4, color: '#004F6E' }}>Turnover Time</span>
              {`provides analytics measuring the duration of time between the end of one case and the beginning of the subsequent 
              case of the block. It also provides a breakdown of this time in terms of cleanup, setup, and idle time. 
              If the time between cases is longer than the ${facilityName} defined cutoff threshold of 
              ${globalFunctions.formatSecsToTime(turnoverThreshold, true, true)} it is omitted from the analysis.`}

            </TabPanel>
            <TabPanel value={tab} index={2} className="panel subtext">
              <span className="bold " style={{ marginRight: 4, color: '#004F6E' }}>Block Utilization</span>
              {`provides analytics on how operating room block hours were used. It provides a breakdown of block hours in 
              terms of setup, cleanup, idle, and case time. It also provides information on how closely the start of first cases of 
              blocks align to the scheduled start of the block, and how closely the end of the last cases of blocks align to the scheduled 
              end of the block.`}


            </TabPanel>
            <TabPanel value={tab} index={3} className="panel subtext">
              <span className="bold " style={{ marginRight: 4, color: '#004F6E' }}>Case Scheduling</span>
              {`provides analytics on whether there was sufficient time scheduled for cases based on their observed 
              durations. When the amount of time allotted for a case was less than 80% of the time that was actually required to avoid 
              a delay to the next case, it is considered to be "Underscheduled". "Change in Delay" is the amount of a case's duration 
              that contributed to a delay in subsequent case. This can be expressed in absolute time (ie. minutes) or as a percentage of 
              the case's duration.`}


            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Modal>
  );
};
export default InformationModal;
