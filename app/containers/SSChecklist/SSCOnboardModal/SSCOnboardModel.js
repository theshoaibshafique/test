import React, { useEffect } from 'react';
import './style.scss';
import { Grid, Modal, DialogContent, IconButton, Button, withStyles, Tabs, Tab } from '@material-ui/core';
import SscOnboard from '../img/SSC_ONBOARD.png';
import CloseIcon from '@material-ui/icons/Close';
const StyledTabs = withStyles({
  root: {
    boxShadow: "0 1px 0 0 rgba(0,0,0,0.2)",
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 5,
    '& > span': {
      width: '100%',
      backgroundColor: '#028CC8',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 14,
    fontFamily: 'Noto Sans',
    opacity: .8,
    fontWeight: 'bold',
    color: '#000 !important',
    minWidth: 'unset',
    paddingLeft: 16,
    paddingRight: 16,
    // marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
function tabIndex(reportType){
  switch (`${reportType}`.toUpperCase()) {
    case 'COMPLIANCE':
      return 0;
    case 'ENGAGEMENT':
      return 1;
    case 'QUALITY':
      return 2;
    default:
      return 0;
  }
}

export function SSCOnboardModal(props) {
  const { open, onClose, reportType } = props;
  const [value, setValue] = React.useState(tabIndex(reportType));
  useEffect(() => {
    setValue(tabIndex(reportType));
  },[props.reportType]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <DialogContent className="sscOnboarding Modal">
        <Grid container spacing={0} justify='center' className="onboard-modal" >
          <Grid item xs={10} className="sscOnboard-title">
            What is the Surgical Safety Checklist Report?
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right', padding: '40px 24px 0 40px' }}>
            <IconButton disableRipple disableFocusRipple onClick={() => onClose()} className='close-button'><CloseIcon fontSize='small' /></IconButton>
          </Grid>
          <Grid item xs={8} className="sscOnboard-paragraph">
            <div className="sscOnboard-paragraph-block1">
              This dashboard offers insights into the Surgical Safety Checklist with respect to three main scores:
              <span className="compliance">Compliance</span>,
              <span className="engagement">Engagement</span>, and
              <span className="quality">Quality</span>.
            </div>
            <div className="sscOnboard-paragraph-block2">
              Each score targets a different aspect of the conduct of the checklist that teams can improve upon to promote its usage and develop a shared understanding of the surgery being performing.
            </div>
            <div style={{ marginTop: 'auto' }}>
              <StyledTabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <StyledTab label="Compliance" />
                <StyledTab label="Engagement" />
                <StyledTab label="Quality" />
              </StyledTabs>
              <TabPanel value={value} index={0} className="tab">
                <div>
                  <span className="compliance">Compliance Score</span> is a measure of how often, and when, each checklist phase was conducted.
                </div>
                <div>
                  The score will be the average of the following criteria:
                </div>
                <ul className="compliance">
                  <li><span>The percentage of checklist phases performed.</span></li>
                  <li><span>The percentage of the checklist phases performed at the correct time.</span></li>
                </ul>
              </TabPanel>
              <TabPanel value={value} index={1} className="tab">
                <div>
                  <span className="engagement">Engagement Score</span>  is a measure of the team’s focus during each phase of the checklist.
                </div>
                <div>
                  The score will be the average of the following criteria:
                </div>
                <ul className="engagement">
                  <li><span>The attendance percentage out of the minimum number of people required during performed checklist phases.</span></li>
                  <li><span>The percentage of those in attendance who paused during performed checklist phases.</span></li>
                </ul>
              </TabPanel>
              <TabPanel value={value} index={2} className="tab">
                <div>
                  <span className="quality">Quality Score</span> is a measure of the information being exchanged during each checklist phase.
                </div>
                <div>
                  The score will be the average of the following criteria:
                </div>
                <ul className="quality">
                  <li><span>The percentage of each item discussed across the performed checklist phases.</span></li>
                </ul>
              </TabPanel>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="sscOnboard-image">
              <img src={SscOnboard} />
            </div>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'right', marginTop: 40 }}>
            <Button disableElevation disableRipple variant="contained" className="primary" style={{ marginRight: 40, marginBottom: 40, position: 'absolute', right: 0, bottom:0 }} onClick={() => onClose()}>Close</Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Modal>
  )
}