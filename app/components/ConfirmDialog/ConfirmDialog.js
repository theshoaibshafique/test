import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ConfirmDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Dialog
        open={this.props.dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="SST-Dialog"
      >
        <DialogTitle id="alert-dialog-title">{this.props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleCancel}>
            {this.props.cancelText}
          </Button>
          <Button onClick={this.props.handleConfirm} color="primary" autoFocus>
            {this.props.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmDialog;
