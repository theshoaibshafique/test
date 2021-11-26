
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Divider, Grid, InputLabel, makeStyles, MenuItem, Modal, TextField, Select, FormControl, ListItemIcon, Checkbox, ListItemText, FormHelperText, IconButton } from '@material-ui/core';
import Icon from '@mdi/react'
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssignableRoles, selectLocationLookups } from '../../App/store/UserManagement/um-selectors';
import { MAX_DESCRIPTION, MAX_INPUT, UM_PRODUCT_ID } from '../../../constants';
import { createClient, deleteClient, generateProductUpdateBody, getRoleMapping, getSelectedRoles, patchRoles, resetClient, updateClientProfile } from '../helpers';
import { makeSelectLogger, makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../../App/selectors';
import { mdiPlaylistEdit, mdiContentCopy } from '@mdi/js';
import { GenericModal, ProfileIcon, SaveAndCancel, StyledTab, StyledTabs, TabPanel } from '../../../components/SharedComponents/SharedComponents';
import { setSnackbar } from '../../App/actions';
import { setClients } from '../../App/store/ApiManagement/am-actions';
import { selectClients } from '../../App/store/ApiManagement/am-selectors';
import { API_INFO } from '../constants';

const CarbonIFrame = props => {
    const { src, style } = props
    return (
        <iframe
            src={src}
            style={style}
            sandbox="allow-scripts allow-same-origin">
        </iframe>
    )
}

export const APILearnMore = props => {
    const HEADER = "How does API Management work?"

    const [tabIndex, setTabIndex] = useState(0);
    const logger = useSelector(makeSelectLogger());
    const handleTabChange = (obj, tabIndex) => {
        setTabIndex(tabIndex);
        logger?.manualAddLog('click', `learn-more-change-tab-${orderedInfo[tabIndex][0]}`, orderedInfo[tabIndex][0]);
    }
    const orderedInfo = Object.entries(API_INFO).sort((a, b) => a[1].order - b[1].order);
    return (
        <GenericModal
            {...props}
            className="api-management-learn-more"
        >
            <div className="header header-2">{HEADER}</div>
            <p className="description subtext">
            To programatically integrate with Insights User Management, administrators may create API users that can securely retrieve access tokens from SST Accounts and make requests to User Management's RESTful HTTP API.
                    For a full list of available endpoints, please see the
                    <a className="link subtext" target="_blank" href="https://api.insights.surgicalsafety.com/api/users/docs">OpenAPI</a> or
                    <a className="link subtext" target="_blank" href="https://api.insights.surgicalsafety.com/api/users/redoc">ReDoc</a>
                    documentation. The
                <span className={`role-cell subtle-subtext View Only`}>View Only</span>
                role gives access to all GET endpoints, and the
                <span className={`role-cell subtle-subtext Full Access`}>Full Access</span>
                role gives access to PUT, POST, and DELETE endpoints.
            </p>
            <p className="description subtext">
                When creating an API user, a client ID and a client secret will be displayed. The client secret must be saved immediately, as it cannot be retrieved later, only reset through the API Management user interface. Using these credentials, you may retrieve short-lived access tokens from SST Accounts. Please see the
                <a className="link subtext" target="_blank" href="https://api.insights.surgicalsafety.com/api/users/docs">OpenAPI</a> or
                <a className="link subtext" target="_blank" href="https://api.insights.surgicalsafety.com/api/users/redoc">ReDoc</a>
                documentation for further details.
            </p>
            <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
            <StyledTabs
                value={tabIndex}
                onChange={(obj, value) => handleTabChange(obj, value)}
                indicatorColor="primary"
                textColor="primary"
            >
                <StyledTab label={"Get Token"} />
                <StyledTab label={"API Request"} />
                <StyledTab label={"Update Secret"} />
            </StyledTabs>
            <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
            <TabPanel value={tabIndex} index={0}>
                <div className="learn-more-content">
                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=python&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520requests%250A%250ACLIENT_ID%2520%253D%2520%27xxxxxxxx%27%250ACLIENT_SECRET%2520%253D%2520%27xxxxxxxx%27%250A%250Aresponse%2520%253D%2520requests.post%28%250A%2520%2520url%253D%27https%253A%252F%252Fapi.accounts.surgicalsafety.com%252Foauth%252Fv1%252Ftoken%27%252C%250A%2520%2520headers%253D%257B%250A%2520%2520%2520%2520%27Content-Type%27%253A%2520%27application%252Fx-www-form-urlencoded%27%252C%250A%2520%2520%2520%2520%27accept%27%253A%2520%27application%252Fjson%27%250A%2520%2520%257D%252C%250A%2520%2520data%253D%257B%250A%2520%2520%2520%2520%27client_id%27%253A%2520CLIENT_ID%252C%250A%2520%2520%2520%2520%27secret%27%253A%2520CLIENT_SECRET%252C%250A%2520%2520%2520%2520%27grant_type%27%253A%2520%27client_credentials%27%250A%2520%2520%257D%250A%29.json%28%29%250A%250Aaccess_token%2520%253D%2520response.get%28%27accessToken%27%29"}
                        style={{ width: 1024, height: 488, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />

                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=curl%2520-X%2520%27POST%27%2520%255C%250A%2520%2520%27https%253A%252F%252Fapi.accounts.surgicalsafety.com%252Foauth%252Fv1%252Ftoken%27%2520%255C%250A%2520%2520-H%2520%27accept%253A%2520application%252Fjson%27%2520%255C%250A%2520%2520-H%2520%27Content-Type%253A%2520application%252Fx-www-form-urlencoded%27%2520%255C%250A%2520%2520-d%2520%27client_id%253DCLIENT_ID%2526grant_type%253Dclient_credentials%2526secret%253DCLIENT_SECRET%27"}
                        style={{ width: 1024, height: 244, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />
                </div>
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
                <div className="learn-more-content">

                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=python&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520requests%250A%250AACCESS_TOKEN%2520%253D%2520%27xxxxxxxx%27%2520%2520%2523%2520retrieve%2520from%2520SST%2520Accounts%250A%250Aresponse%2520%253D%2520requests.get%28%250A%2520%2520url%253D%27https%253A%252F%252Fapi.insights.surgicalsafety.com%252Fapi%252Fusers%252Fv2%252Fprofiles%27%252C%250A%2520%2520headers%253D%257B%250A%2520%2520%2520%2520%27accept%27%253A%2520%27application%252Fjson%27%252C%250A%2520%2520%2520%2520%27Authorization%27%253A%2520f%27Bearer%2520%257BACCESS_TOKEN%257D%27%250A%2520%2520%257D%250A%29"}
                        style={{ width: 1024, height: 344, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />
                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=curl%2520-X%2520%27GET%27%2520%255C%250A%2520%2520%27https%253A%252F%252Fapi.insights.surgicalsafety.com%252Fapi%252Fusers%252Fv2%252Fprofiles%27%2520%255C%250A%2520%2520-H%2520%27accept%253A%2520application%252Fjson%27%2520%255C%250A%2520%2520-H%2520%27Authorization%253A%2520Bearer%2520ACCESS_TOKEN%27%2520"}
                        style={{ width: 1024, height: 218, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />
                </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <div className="learn-more-content">

                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=python&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520requests%250A%250ACLIENT_ID%2520%253D%2520%27xxxxxxxx%27%250ACLIENT_SECRET%2520%253D%2520%27xxxxxxxx%27%250A%250Aresponse%2520%253D%2520requests.put%28%250A%2520%2520url%253D%27https%253A%252F%252Fapi.accounts.surgicalsafety.com%252Foauth%252Fv1%252Fupdate%27%252C%250A%2520%2520headers%253D%257B%250A%2520%2520%2520%2520%27Content-Type%27%253A%2520%27application%252Fx-www-form-urlencoded%27%252C%250A%2520%2520%2520%2520%27accept%27%253A%2520%27application%252Fjson%27%250A%2520%2520%257D%252C%250A%2520%2520data%253D%257B%250A%2520%2520%2520%2520%27client_id%27%253A%2520CLIENT_ID%252C%250A%2520%2520%2520%2520%27secret%27%253A%2520CLIENT_SECRET%252C%250A%2520%2520%2520%2520%27phase%27%253A%2520%27secret%27%250A%2520%2520%257D%250A%29.json%28%29%250A%250Anew_secret%2520%253D%2520response.get%28%27secret%27%29"}
                        style={{ width: 1024, height: 488, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />
                    <CarbonIFrame
                        src={"https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=24px&ph=172px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=curl%2520-X%2520%27PUT%27%2520%255C%250A%2520%2520%27https%253A%252F%252Fapi.accounts.surgicalsafety.com%252Foauth%252Fv1%252Fupdate%27%2520%255C%250A%2520%2520-H%2520%27accept%253A%2520application%252Fjson%27%2520%255C%250A%2520%2520-H%2520%27Content-Type%253A%2520application%252Fx-www-form-urlencoded%27%2520%255C%250A%2520%2520-d%2520%27client_id%253DCLIENT_ID%2526phase%253Dsecret%2526secret%253DCLIENT_SECRET%27"}
                        style={{ width: 1024, height: 248, border: 0, transform: 'scale(1)', overflow: 'hidden' }}
                    />

                </div>
            </TabPanel>
        </GenericModal>
    )
}

export const ClipboardField = props => {
    const classes = useStyles();
    const { value, warning, title, className, id, isView, size } = props;
    const dispatch = useDispatch();
    const copyToClipboard = () => {
        navigator?.clipboard?.writeText?.(value);
        document.getElementById(id ?? 'clipboard-field')?.select?.()
        dispatch(setSnackbar({ severity: 'success', message: `Copied to clipboard.` }))
    }
    if (isView) {
        return (
            <div className={className}>
                {`${title}: ${value}`}
                <IconButton
                    onClick={() => copyToClipboard()}
                    title="copy"
                >
                    <Icon
                        color="#828282" path={mdiContentCopy} size={size ?? '18px'} />
                </IconButton>
            </div>
        )
    }

    return (
        <div className={className}>
            <InputLabel className={classes.inputLabel}>{title}</InputLabel>
            <span className='flex'>
                <TextField
                    size="small"
                    fullWidth
                    id={id ?? 'clipboard-field'}
                    value={value}
                    variant="outlined"
                    disabled
                    onClick={() => copyToClipboard()}
                    helperText={warning && <span style={{ marginLeft: -14, color: '#004F6E' }}>{warning}</span>}
                />
                <div >
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={copyToClipboard}
                        submitText={'Copy'}
                    />
                </div>
            </span>
        </div>
    )
}

export const ClientSuccessModal = props => {
    const { clientName, clientSecret, clientId, tableData } = props || {};
    const toggleModal = (d) => {
        if (d == false) {
            d = { ...props, open: false }
        }
        props?.toggleModal?.(d);
    }
    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className="client-success"
        >
            <>
                <div className="header header-2">
                    API User Added
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p><b className="breakword">{clientName}</b> has been added.</p>
                </div>
                <ClipboardField
                    className="copy-field subtext contents"
                    title={"Client ID"}
                    id="clientId-field"
                    value={clientId}
                    isView
                    size={'20px'}
                />
                <ClipboardField
                    title={"Client Secret"}
                    id="clientSecret-field"
                    warning="The Client Secret will only be displayed now."
                    value={clientSecret}
                />
            </>
        </GenericModal>
    )
}

export const DeleteUserModal = props => {
    const { clientName, clientId, tableData } = props?.user || {};
    const userTable = useSelector(selectClients());
    const userToken = useSelector(makeSelectToken());
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const fetchDelete = async () => {
        setIsLoading(true)
        const response = await deleteClient({ clientId, scope: 2 }, userToken);
        const modified = [...userTable];
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified.splice(id, 1);
        }
        dispatch(setSnackbar({ severity: 'success', message: `${clientName} has been deleted.` }))
        dispatch(setClients(modified))
        toggleModal(false);
        setIsLoading(false);
    }
    const toggleModal = (d) => {
        if (d == false) {
            d = { ...props.user, open: false }
        }
        props?.toggleModal?.(d);
    }
    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className="user-delete"
        >
            <>
                <div className="header header-2">
                    Delete API User
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                <div className="contents subtext">
                    <p>Are you sure you want to delete <b className="breakword">{clientName}</b>?</p>
                    <p>Deleted API user will not have any access to Insights.</p>
                </div>
                <div className="close">
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={() => fetchDelete()}
                        submitText={'Delete'}
                        disabled={isLoading}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                </div>

            </>
        </GenericModal>
    )
}

const defaultViewState = {
    viewProfile: true,
    viewAdminAccess: true
};
const userReducer = (state, event) => {
    if (event.name == 'new-user') {
        //Reseting the state for Add users
        return event.value;
    } else if (event.name == 'save-settings') {
        //Saving clears the backup (which existed for 'cancel')
        event.name = 'viewState';
        event.value = defaultViewState

        state.backup = null;
    } else if (event.name == 'save-cancel') {
        //Revert to previous state on cancel
        return {
            ...state.backup,
            backup: null
        }
    } else if (event.name == 'view') {
        const { id, value } = event.value;
        event.name = 'viewState'
        event.value = {
            ...state.viewState,
            [id]: value
        }
        //Back up the current state for if the user cancels
        state.backup = JSON.parse(JSON.stringify(state));
    } else if (event.name == 'roles') {
        const roles = state?.roles || {};
        const { current, id, value, productId } = event.value;
        //Delete current role in lists - If we select viewer we want to remove Admin
        if (current) {
            for (var r of current) {
                delete roles[r]
            }
        }
        roles[id] = value;
        //Clear errors for Access Level
        if (productId && state.errorState?.[productId]) {
            state.errorState[productId] = null;
        }

        event.name = 'roles';
        event.value = roles
    } else {
        //Validate by default 
        const errorState = state?.errorState || {};
        //If manual validate (on blur) vs if ttheyre updating the field directly
        const { id, value } = event.name == 'validate' ? event.value : { id: event.name, value: event.value };
        const isValidateAll = id == 'all';

        if (id == 'clientName' || isValidateAll) {
            errorState['clientName'] = (value ?? state?.clientName) ? null : '​Please enter a API user';
        }

        state.errorState = errorState;
    }


    return {
        ...state,
        [event.name]: event.value
    }
}

// Used for Text fields
const useStyles = makeStyles((theme) => ({
    inputLabel: {
        fontFamily: 'Noto Sans',
        fontSize: '14px',
        lineHeight: '19px',
        marginBottom: 4,
        color: '#000000',
        opacity: .8,
    }
}));


export const AddEditUserModal = props => {
    const dispatch = useDispatch();
    const { user } = props;
    const isAddUser = !Boolean(user?.clientId);
    //if we're adding a new user we edit all sections at once
    const viewObject = isAddUser ? null : defaultViewState;
    const locationLookups = useSelector(selectLocationLookups());
    const [userData, setUserData] = useReducer(userReducer, { ...user, viewState: viewObject, locationLookups });

    const userToken = useSelector(makeSelectToken());
    const assignableRoles = useSelector(selectAssignableRoles());
    const logger = useSelector(makeSelectLogger());



    const isView = Object.values(userData?.viewState || {}).every((v) => v) && userData?.viewState;

    const [isLoading, setIsLoading] = useState(false);

    const isSingleEdit = Object.values(userData?.viewState || {}).filter(t => !t).length == 1;
    const { errorState } = userData;
    const isSubmitable = !Object.values(errorState || {}).some((d) => d) && (
        userData?.['clientName']
    );
    const { viewProfile, viewAdminAccess, ...viewPermissions } = userData?.viewState || (!props.open && isSubmitable ? defaultViewState : {});
    //Reload the state every time user changes
    useEffect(() => {
        handleChange('new-user', { ...user, viewState: viewObject, locationLookups });
    }, [user])

    const handleChange = (name, value) => {

        setUserData({
            name, value, isSingleEdit
        })
        !['validate', 'new-user', 'errorState'].includes(name) && logger?.manualAddLog('onchange', name, value)
    }
    const createUserError = (result) => {
        setIsLoading(false);
        handleChange('view', { id: 'viewProfile', value: false });
        errorState['email'] = result?.detail
        handleChange('errorState', errorState);
        dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. API user could not be created.` }));
    }


    const handleSubmit = (event) => {
        if (event == 'save-settings') {
            handleChange('save-settings');
        } else if (event == 'add-user') {

            //Post call to add user
            setIsLoading(true);
            const createUserSuccess = (client) => {
                const { clientId, clientSecret } = client || {};
                const { clientName } = userData;
                dispatch(setSnackbar({ severity: 'success', message: `${clientName} has been added.` }));
                updateTable(clientId);
                toggleModal(false);
                setIsLoading(false);

                props.setClientSecret?.({ clientName, clientSecret, clientId });

            }

            createClient(userData, createUserSuccess, createUserError, userToken, assignableRoles);
        }
    }

    const userTable = useSelector(selectClients());
    const productRoles = useSelector(makeSelectProductRoles());
    const updateTable = (clientId) => {
        const { tableData, clientName, description, roles } = userData || {};
        const modified = [...userTable];
        const updatedUser = {
            clientId,
            clientName, description,
            displayRoles: getRoleMapping(roles, Object.values(productRoles)),
            roles
        };
        const id = modified.findIndex((u) => u.clientId == clientId);
        if (id >= 0) {
            modified[id] = { ...modified[id], ...updatedUser };
        } else {
            modified.push({ ...updatedUser, tableData: { id: modified.length } })
        }
        dispatch(setClients(modified))
    }

    const handleRoleSubmit = async () => {
        const { clientId, roles, clientName } = userData;
        handleChange('save-settings');
        const productUpdates = generateProductUpdateBody(roles, assignableRoles);
        const profile = await patchRoles({ userId: clientId, scope: 2, productUpdates }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${clientName} has been updated.` }))
                updateTable(clientId);
            }
        })
    }

    const handleProfileSubmit = async () => {
        const { clientId, clientName, description } = userData;
        handleChange('save-settings');
        const profile = await updateClientProfile({ clientId, clientName, description }, userToken).then((e) => {
            if (e == 'error') {
                dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            } else {
                dispatch(setSnackbar({ severity: 'success', message: `${clientName} has been updated.` }))
                updateTable(clientId);
            }
        })
    }

    const toggleModal = (d) => {
        if (d == false) {
            d = { ...userData, open: false }
        }
        props?.toggleModal?.(d);
        setIsLoading(false);
    }

    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className={`add-edit-user client ${!isAddUser && 'is-edit-client'} ${isSingleEdit && 'single-edit'} `}
        >
            <>
                <ProfileSection {...userData} isView={viewProfile} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleProfileSubmit} />
                <AdminPanelAccess {...userData} isAddUser={isAddUser} isView={viewAdminAccess} isSingleEdit={isSingleEdit} handleChange={handleChange} handleSubmit={handleRoleSubmit} />
                {isAddUser && (
                    <SaveAndCancel
                        className={"add-user-buttons"}
                        disabled={isLoading}
                        handleSubmit={() => !isSubmitable ? handleChange('validate', { id: 'all' }) : handleSubmit(isView ? 'add-user' : 'save-settings')}
                        submitText={(isView ? 'Add API User' : 'Save')}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                )}
            </>
        </GenericModal>
    )
}


const AdminPanelAccess = props => {
    const { handleChange, roles, isView, isSingleEdit, handleSubmit, isAddUser } = props;
    const assignableUMRoles = useSelector(selectAssignableRoles())?.[UM_PRODUCT_ID]?.productRoles || {};
    const { umRoles } = useSelector(makeSelectProductRoles());
    const { roleDisplay, roleId } = getSelectedRoles(roles, umRoles);
    const locationLookups = useSelector(selectLocationLookups());
    //User management has a default scope of Facility
    const [defaultFacility, other] = Object.entries(locationLookups).find(([lId, l]) => l?.scopeId == 2);
    let content = null;
    const getLocationObject = (value) => {
        return {
            current: [roleId],
            value: {
                scope: { f: [defaultFacility] }
            },
            id: value,
            productId: UM_PRODUCT_ID
        }
    }
    if (isView) {
        content = (
            <div className="role-display">
                <span>{roleDisplay}</span>
                <span className={`action-icon pointer`} title={'Edit User Management Access'} onClick={() => handleChange('view', { id: 'viewAdminAccess', value: false })}>
                    <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                </span>
            </div>
        )
    } else {
        content = (
            <>
                <FormControl
                    className="admin-select"
                    variant='outlined' size='small' >
                    <Select
                        displayEmpty
                        id="admin-setting"
                        value={roleId}
                        style={{ width: 200 }}
                        onChange={(e, v) => handleChange('roles', getLocationObject(e.target.value))}
                    >
                        {Object.entries(assignableUMRoles).map(([roleId, role]) => (
                            <MenuItem key={roleId} value={roleId}>{role?.displayName}</MenuItem>
                        ))}
                        <MenuItem value={null}>No Access</MenuItem>
                    </Select>
                    {isSingleEdit && <SaveAndCancel
                        className={"save-admin-panel-access"}
                        handleSubmit={() => isAddUser ? handleChange('save-settings') : handleSubmit()}
                        submitText={'Save'}
                        isLoading={false}
                        cancelText={"Cancel"}
                        handleCancel={() => handleChange('save-cancel')}
                    />}
                </FormControl>

            </>
        )
    }

    return (
        <div className="admin-panel-access">
            <div className="subtle-subtext title">User Management Access</div>
            <Divider className="divider" />
            {content}
            <Divider className="divider" />
        </div>
    )
}

const ConfirmReset = props => {
    const dispatch = useDispatch();
    const { clientName, clientId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(false)
    const userToken = useSelector(makeSelectToken());
    const scope = 2;
    const handleReset = async () => {
        setIsLoading(true);
        const secret = await resetClient({ clientId, scope }, userToken)

        if (secret == 'error') {
            dispatch(setSnackbar({ severity: 'error', message: `Something went wrong. Could not update API user.` }))
            setIsLoading(false);
            return
        }

        setClientSecret(secret?.clientSecret);
        setIsLoading(false);
        // toggleModal(false);
        dispatch(setSnackbar({ severity: 'success', message: `${clientName}'s secret has been reset.` }))
    }
    const toggleModal = (open) => {
        props.toggleModal?.(open);
    }
    var content = null;
    if (clientSecret) {
        content = (
            <>
                <div className="contents subtle-subtext">
                    <p><b className="breakword">{clientName}</b> has been reset.</p>
                </div>
                <ClipboardField
                    warning="The Client Secret will only be displayed now."
                    title={"Client Secret"}
                    className="subtle-subtext"
                    value={clientSecret}
                />
            </>
        )
    } else {
        content = (
            <>
                <div className="contents subtext">
                    <p>Are you sure you want to reset the Client Secret of <b className="breakword">{clientName}</b>?</p>
                    <p>Resetting the client secret will invalidate the current secret, and leave <b className="breakword">{clientName}</b> unable to authenticate until its credentials are updated.</p>
                </div>
                <div className="close">
                    <SaveAndCancel
                        className={"delete-user-buttons"}
                        handleSubmit={() => handleReset()}
                        submitText={'Confirm'}
                        disabled={isLoading}
                        isLoading={isLoading}
                        cancelText={"Cancel"}
                        handleCancel={() => toggleModal(false)}
                    />
                </div>
            </>
        )
    }
    return (
        <GenericModal
            {...props}
            toggleModal={toggleModal}
            className="secret-reset">
            <>
                <div className="header header-2">
                    Reset Client Secret
                </div>
                <Divider className="divider" style={{ backgroundColor: '#F2F2F2' }} />
                {content}

            </>
        </GenericModal>
    )
}

const ProfileSection = props => {
    const { handleChange, isView, errorState, isSingleEdit, handleSubmit } = props;
    const { clientName, description, datetimeJoined, clientId } = props;
    const classes = useStyles();
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    if (isView) {
        return (
            <div className="view-profile client">
                <div className="client-info">
                    <div>
                        <ProfileIcon className="header-1 api-icon" size={95} override={"API"} />

                    </div>
                    <div className="profile-info">
                        <div className="header-2 ellipses" title={clientName}>{clientName}</div>
                        {clientId && <ClipboardField
                            className="copy-field subtle-subtext"
                            title={"Client ID"}
                            id="clientId-field"
                            value={clientId}
                            isView
                        />}
                        {clientId && <div className="subtle-text">{`Created on ${moment(datetimeJoined).format('MMMM DD, YYYY')}`}</div>}
                        {clientId && (
                            <a className="link reset-account subtle-text" onClick={() => setShowConfirmReset(true)}>
                                Reset Client Secret
                            </a>
                        )}
                    </div>
                    <span className={`action-icon pointer edit-profile-icon`} title={'Edit Profile'} onClick={() => handleChange('view', { id: 'viewProfile', value: false })}>
                        <Icon className={`edit`} color="#828282" path={mdiPlaylistEdit} size={'24px'} />
                    </span>
                </div>

                <div className="subtle-text description">{description}</div>
                <ConfirmReset
                    open={showConfirmReset}
                    toggleModal={setShowConfirmReset}
                    clientName={clientName}
                    clientId={clientId}
                />
            </div>
        )
    }
    return (
        <div className="edit-profile">
            <InputLabel className={classes.inputLabel}>API User</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-clientName`}
                value={props?.['clientName']}
                onChange={(e, v) => handleChange('clientName', e.target.value)}
                onBlur={(e) => handleChange('validate', { id: 'clientName' })}
                variant="outlined"
                error={Boolean(errorState?.['clientName'])}
                inputProps={{ maxLength: MAX_INPUT }}
                helperText={<span style={{ marginLeft: -14 }}>{errorState?.['clientName']}</span>}
            />
            <InputLabel className={classes.inputLabel}>Description</InputLabel>
            <TextField
                size="small"
                fullWidth
                id={`edit-description`}
                value={props?.['description']}
                onChange={(e, v) => handleChange('description', e.target.value)}
                onBlur={(e) => handleChange('validate', { id: 'description' })}
                variant="outlined"
                multiline
                rows={5}
                inputProps={{ maxLength: MAX_DESCRIPTION }}
                helperText={<span style={{ marginRight: -14, float: 'right' }}>{props?.['description']?.length ?? 0}</span>}
            />
            {isSingleEdit && <SaveAndCancel
                className={"save-profile"}
                disabled={errorState?.['clientName']}
                handleSubmit={() => clientId ? handleSubmit() : handleChange('save-settings')}
                submitText={'Save'}
                isLoading={false}
                cancelText={"Cancel"}
                handleCancel={() => handleChange('save-cancel')}
            />}
        </div>

    )
}

