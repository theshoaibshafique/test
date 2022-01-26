import React, { useEffect, useReducer, useState } from 'react';
import { makeStyles, Radio, Switch, Tab, Tabs, Tooltip, withStyles, Snackbar, IconButton, SnackbarContent, Button, Modal, Fade, Backdrop } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { exitSnackbar, setSnackbar } from '../../containers/App/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeSelectLogger,
  makeSelectProductRoles,
  makeSelectSnackbar,
  makeSelectToken,
} from '../../containers/App/selectors';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react'
import { MTableCell } from 'material-table';
import {
  selectAssignableRoles,
  selectLocationLookups,
  selectUsers,
} from '../../containers/App/store/UserManagement/um-selectors';
import {
  createClient,
  createUser,
  generateProductUpdateBody,
  getRoleMapping,
  patchRoles, updateClientProfile,
} from '../../containers/AdminPanel/helpers';
import { setUsers } from '../../containers/App/store/UserManagement/um-actions';
import { selectClients } from '../../containers/App/store/ApiManagement/am-selectors';
import { setClients } from '../../containers/App/store/ApiManagement/am-actions';
import './style.scss';
import UnionLogo from './img/Union.svg';

export const LightTooltip = withStyles((theme) => ({
  tooltipPlacementTop: {
    margin: '8px 0'
  },
  tooltipPlacementBottom: {
    margin: '8px 0'
  },
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export const StyledTabs = withStyles({
  root: {
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.2)",
    padding: "0 16px",
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 5,
    '& > span': {
      width: '100%',
      opacity: .8,
      backgroundColor: '#004f6e',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 14,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    color: '#4f4f4f',
    minWidth: 'unset',
    margin: "0 24px",
    padding: 0,
    '&:focus': {
      opacity: 1,
    },
  },
  selected: {
    color: '#004f6e !important'
  }
}))((props) => <Tab disableRipple {...props} />);

export function TabPanel(props) {
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

const useStylesRadio = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#014F6E,#014F6E 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    // backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
});

export function StyledRadio(props) {
  const classes = useStylesRadio();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.checkedIcon} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export const SSTSwitch = withStyles((theme) => ({
  switchBase: {
    color: '#ABABAB',
    '&$checked': {
      color: '#3DB3E3',
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#028CC8',
    },
  },
  checked: {},
  track: {
    opacity: 1,
    backgroundColor: '#575757'
  }
}))(Switch);


export const StyledSnackbarContent = withStyles((theme) => ({
  message: {
    padding: '6px 0'
  }
}))(SnackbarContent);


export const SSTSnackbar = props => {
  const dispatch = useDispatch();
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const snackList = useSelector(makeSelectSnackbar());
  const { message, severity } = messageInfo || {};
  useEffect(() => {
    setSnackPack(snackList);
  }, [snackList])

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      dispatch(exitSnackbar());
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleExited = () => {
    setMessageInfo(undefined);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      key={message}
      TransitionProps={{ onExited: handleExited }}

      autoHideDuration={4000}
      open={open}
      onClose={handleClose}
    >
      <StyledSnackbarContent
        message={<div className="snackbar subtle-subtext"><span className={severity}></span>{message}</div>}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  )
}

const useProfileIconStyles = makeStyles({
  root: (props) => ({
    margin: 'auto',
    color: '#fff !important',
    textAlign: 'center',
    background: '#004f6e',
    userSelect: 'none',
    width: props?.size ?? 95,
    height: props?.size ?? 95,
    lineHeight: `${props?.size ?? 95}px !important`,
    borderRadius: props?.size ? props?.size / 2 : 48
  })
});

export const ProfileIcon = props => {
  const { firstName, lastName, className, size, override } = props;
  const classes = useProfileIconStyles({ size })
  const initials = `${firstName?.substring(0, 1)}${lastName?.substring(0, 1)}`.toUpperCase();
  return (
    <div className={`${className} ${classes.root}`}>{override ?? initials}</div>
  )

}

export const SaveAndCancel = props => {
  const { className, handleSubmit, handleCancel, isLoading, submitText, cancelText, disabled } = props;
  return (
    <div className={`${className} save-and-cancel`}>
      <Button id="save" variant="outlined" className="primary" disabled={disabled} onClick={() => handleSubmit()}>
        {(isLoading) ? <div className="loader"></div> : submitText}
      </Button>
      {cancelText && <Button id="cancel" style={{ color: "#3db3e3" }} onClick={() => handleCancel()}>{cancelText}</Button>}
    </div>
  )
}

/*
    Generic Modal thats empty with an X in the corner
*/
export const GenericModal = props => {
  const { children, toggleModal, className, open } = props;
  const fadeTime = 500;
  const fade = props.fade ?? { appear: fadeTime, enter: fadeTime, exit: fadeTime };
  const Wrapper = fade ? Fade : React.Fragment;
  return (
    <Modal
      open={open}
      onClose={() => toggleModal(false)}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: fade?.exit
      }}
    >
      <Wrapper in={open} timeout={fade}>
        <div className={`Modal generic-modal ${className}`}>
          <div className="close-button" >
            <Icon className={`pointer`} onClick={() => toggleModal(false)} color="#000000" path={mdiClose} size={'19px'} />
          </div>
          {children}
        </div>
      </Wrapper>
    </Modal>
  )
}

const useTableCellStyles = makeStyles({
  root: (props) => ({
    maxWidth: props?.maxWidth ?? 'unset'
  })
});
export const TableCell = (props) => {
  const { columnDef, rowData, width, maxWidth } = props;
  const { tableData } = columnDef || {}
  const classes = useTableCellStyles({ maxWidth: maxWidth ?? width })
  //We need to manually override the width because theres an inherit bug where width is set on an infinite loop
  return (
    <MTableCell {...props} title={rowData?.[columnDef?.field]} className={`ellipses ${classes.root}`} columnDef={{ ...columnDef, tableData: { ...tableData, width: `${width}px` } }} />
  )
}

export const SwitchFacilityModal = props => {
  const toggleModal = (d) => {
    props?.toggleModal?.(d);
  }

  return (
    <GenericModal
      {...props}
      toggleModal={toggleModal}
      className={`add-edit-user client`}
    >
    {/*  TODO create UI*/}
      <div className={'modal-header'}>
        Switch Facility
      </div>
      <hr />
      <div className={'modal-content'}>
        <div className={'current-facility'}>
          <div className={'current-facility__img'}>
            <img src={'https://www.danielshealth.ca/sites/danielshealth.ca/files/styles/380x370/public/Image%20List%20Graphics/Deployment%20icons%201.png?itok=gQ3vAwIA'}/>
          </div>
          <div className={'current-facility__desc'}>
            <div className={'current-facility__label'}>
              <span>Currently Viewing</span>
            </div>
            <div className={'current-facility__name'}>
              <span>Parkland Hospital</span>
            </div>
          </div>
        </div>

        <div className={'other-facilities'}>
          <div className={'other-facilities__list-item'}>
            <div className={'other-facilities__img'}>
              <img src={'https://www.danielshealth.ca/sites/danielshealth.ca/files/styles/380x370/public/Image%20List%20Graphics/Deployment%20icons%201.png?itok=gQ3vAwIA'}/>
            </div>
            <div className={'other-facilities__name'}>
              <span>UT Southwestern Hospital</span>
            </div>
            <div className={'other-facilities__action'}>
              <img src={UnionLogo}/>
            </div>
          </div>

          <div className={'other-facilities__list-item'}>
            <div className={'other-facilities__img'}>
              <img src={'https://www.danielshealth.ca/sites/danielshealth.ca/files/styles/380x370/public/Image%20List%20Graphics/Deployment%20icons%201.png?itok=gQ3vAwIA'}/>
            </div>
            <div className={'other-facilities__name'}>
              <span>Humber River Hospital</span>
            </div>
            <div className={'other-facilities__action'}>
              <img src={UnionLogo}/>
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  )
}
