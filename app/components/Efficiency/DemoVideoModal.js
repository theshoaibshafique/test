import React from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import './demoVideoModal.scss';
import { PublicVideoVideoPlayer } from '../VideoPlayer/PublicVideoVideoPlayer';


const closeButtonStyles = makeStyles({
  item: {
    marginRight: '-2px',
    marginTop: '18px',
    textAlign: 'right',
    paddingRight: 20,
  },
});
const equalProps = (props, prevProps) => prevProps === props;
/*
* @param {boolean} open - Flag for determining if the modal is open
* @param {Function} onToggle - Function used to toggle the dashboard as open / closed
*/
const DemoVideoModal = React.memo(({
  open,
  onToggle,
}) => {
  const closeClass = closeButtonStyles();
  return (

    <Modal open={open} onClose={onToggle}>
      <DialogContent className="efficiency-content modal">
        <Grid container spacing={0} justify="center">
          <Grid item xs={10} className="title header-2">
            What&apos;s new?
          </Grid>
          <Grid item xs={2} className={closeClass.item}>
            <IconButton disableRipple disableFocusRipple onClick={onToggle} className="close"><CloseIcon
              fontSize="small"
            />
            </IconButton>
          </Grid>

        </Grid>
        <PublicVideoVideoPlayer
          src={'https://media.insights.surgicalsafety.com/public/efficiency/demo/hls.m3u8'}
        />
      </DialogContent>
    </Modal>
  );
}, equalProps);
export default DemoVideoModal;
