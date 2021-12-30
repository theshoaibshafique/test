import React from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { StyledTab, StyledTabs, TabPanel } from '../SharedComponents/SharedComponents';
import './informationModal.scss';

const closeButtonStyles = makeStyles({
  item: {
    marginRight: '-2px',
    marginTop: '18px',
    textAlign: 'right'
  }
});


const InformationModal = ({ open, onToggle }) => {
  const closeClass = closeButtonStyles();
  const [tab, setTab] = React.useState(0);
  const handleTabChange = React.useCallback((_, value) => {
    setTab(value);
  }, []);
  return (

    <Modal open={open} onClose={onToggle}>
      <DialogContent className="efficiency-content modal">
        <Grid container spacing={0} justify="center">
          <Grid item xs={10} className="title">
            What is the Efficiency Dashboard?
          </Grid>
          <Grid item xs={2} className={closeClass.item}>
            <IconButton disableRipple disableFocusRipple onClick={onToggle} className="close"><CloseIcon fontSize="small" /></IconButton>
          </Grid>
          <Grid item xs={12} className="column">
            <Grid container spacing={0} direction="column">
              <Grid item xs className="paragraph">
                This dashboard offers insights into the function of the operating room during elective hours according to three main categories
              </Grid>
              <Grid item xs={12}>
                <div className="efficiencyOnBoard-segment">
                  <h5 className="subtitle">
                    Segmenting the data:
                  </h5>
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
            <TabPanel value={tab} index={0} style={{ marginBottom: 40 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae purus purus euismod sagittis quam a, tristique. Aliquam lorem integer eu, diam sed in sociis nunc. Bibendum ut lorem auctor rhoncus leo placerat nibh. Urna hendrerit congue feugiat risus, proin. Sem feugiat tellus pretium, tincidunt orci ac. Sed leo pellentesque pretium habitasse adipiscing condimentum. Diam aliquet nulla enim montes, consequat.

            </TabPanel>
            <TabPanel value={tab} index={1} style={{ marginBottom: 40 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae purus purus euismod sagittis quam a, tristique. Aliquam lorem integer eu, diam sed in sociis nunc. Bibendum ut lorem auctor rhoncus leo placerat nibh. Urna hendrerit congue feugiat risus, proin. Sem feugiat tellus pretium, tincidunt orci ac. Sed leo pellentesque pretium habitasse adipiscing condimentum. Diam aliquet nulla enim montes, consequat.

            </TabPanel>
            <TabPanel value={tab} index={2} style={{ marginBottom: 40 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae purus purus euismod sagittis quam a, tristique. Aliquam lorem integer eu, diam sed in sociis nunc. Bibendum ut lorem auctor rhoncus leo placerat nibh. Urna hendrerit congue feugiat risus, proin. Sem feugiat tellus pretium, tincidunt orci ac. Sed leo pellentesque pretium habitasse adipiscing condimentum. Diam aliquet nulla enim montes, consequat.

            </TabPanel>
            <TabPanel value={tab} index={3} style={{ marginBottom: 40 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae purus purus euismod sagittis quam a, tristique. Aliquam lorem integer eu, diam sed in sociis nunc. Bibendum ut lorem auctor rhoncus leo placerat nibh. Urna hendrerit congue feugiat risus, proin. Sem feugiat tellus pretium, tincidunt orci ac. Sed leo pellentesque pretium habitasse adipiscing condimentum. Diam aliquet nulla enim montes, consequat.

            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Modal>
  );
};
export default InformationModal;
