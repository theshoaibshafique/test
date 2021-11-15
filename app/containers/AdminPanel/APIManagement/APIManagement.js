import React, { forwardRef, useEffect, useState } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import MaterialTable, { MTableBody, MTableCell, MTableToolbar } from 'material-table';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import './style.scss';
import { Button, MenuItem, Paper, TableHead, TableRow, TableSortLabel, Menu, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDropDown } from '@material-ui/icons';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckboxOutline, mdiLockOutline, mdiFilter } from '@mdi/js';
import { mdiDeleteOutline, mdiPlaylistEdit } from '@mdi/js';
import { AddEditUserModal, DeleteUserModal, APILearnMore, ClientSuccessModal } from './Modals';
import { LightTooltip, TableCell } from '../../../components/SharedComponents/SharedComponents';
import { UM_PRODUCT_ID } from '../../../constants';
import { makeSelectLogger, makeSelectProductRoles } from '../../App/selectors';
import { selectClients, selectFilters, selectApiAssignableRoles } from '../../App/store/ApiManagement/am-selectors';
import { setApiFilters } from '../../App/store/ApiManagement/am-actions';


const tableIcons = {
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
};
const areEqual = (prevProps, nextProps) => {
    return true
};
const MemoTable = React.memo(props => {
    const { columns } = props;
    const users = useSelector(selectClients());
    const [USERS, setUsers] = useState(users);
    useEffect(() => {
        if (JSON.stringify(users) != JSON.stringify(USERS)) {
            setUsers(users);
        }
    }, [users])

    if (!USERS) {
        return <LoadingIndicator />
    }
    //Force undefined with to prevent infinite loop
    return <MaterialTable {...props} columns={[...columns.map((c) => { return { ...c, tableDef: { width: undefined } } })]} data={USERS} />
}, areEqual)

export const APIManagement = props => {
    const { umRoles } = useSelector(makeSelectProductRoles());

    const [selectedUser, setSelectedUser] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [showLearnMore, setShowLearnMore] = useState(false);
    const [clientSecret, setClientSecret] = useState(false);
    const logger = useSelector(makeSelectLogger());
    const handleUserSelect = (user, isEdit) => {
        setSelectedUser(user);
        console.log(user);
        logger?.manualAddLog('click', isEdit ? `edit-user-${user?.clientId}` : (user ? 'add-user' : 'close-user-modal'), user);
    }
    const handleDeleteSelect = (del) => {
        setDeleteUser(del);
        logger?.manualAddLog('click', del ? `delete-user-${del?.clientId}` : 'close-delete-user', del);
    }
    const handleLearnMoreSelect = (open) => {
        setShowLearnMore(open)
        logger?.manualAddLog('click', open ? `open-learn-more` : 'close-learn-more');
    }
    return (
        <div className="user-management">
            <MemoTable
                title=""
                columns={[
                    { title: "API User", field: 'clientName', defaultSort: 'asc' },
                    { title: "Client ID", field: 'clientId' },
                    generateRoleColumn("User Management", UM_PRODUCT_ID),
                    { title: "Description", field: 'description' },
                ]}
                actions={umRoles?.isAdmin ? [
                    {
                        icon: 'edit',
                        tooltip: 'Edit API User',
                        onClick: (user) => handleUserSelect(JSON.parse(JSON.stringify(user)), true)
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete API User',
                        onClick: (user) => handleDeleteSelect(user)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Add API User',
                        isFreeAction: true,
                        onClick: (user) => handleUserSelect(true)
                    },
                    {
                        icon: 'learn-more',
                        tooltip: 'Learn More',
                        isFreeAction: true,
                        onClick: (user) => handleLearnMoreSelect(true)
                    }
                ] : [{
                    icon: 'learn-more',
                    tooltip: 'Learn More',
                    isFreeAction: true,
                    onClick: (user) => handleLearnMoreSelect(true)
                }]}
                options={{
                    search: true,
                    paging: false,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: { marginLeft: -40, height: 40, width: 307 },
                    thirdSortClick: false,
                    draggable: false,
                    searchFieldVariant: 'outlined',
                    rowStyle: {
                        fontFamily: "Noto Sans",
                        fontSize: 14,
                        width: 'unset'
                    },
                    maxBodyHeight: "calc(100vh - 300px)",
                    actionsColumnIndex: -1
                }}
                // data={USERS}
                icons={tableIcons}
                components={{
                    Container: props => <Paper {...props} elevation={0} className="table-container" />,
                    Body: props => <TableBody {...props} />,
                    Header: props => <TableHeader {...props} isAdmin={umRoles?.isAdmin} />,
                    Action: props => <TableActions {...props} />,
                    Toolbar: props => <MTableToolbar {...props} />,
                    Cell: props => <TableCell {...props} {...calculateWidth(props)} />

                }}
            />
            <APILearnMore
                open={showLearnMore}
                toggleModal={handleLearnMoreSelect}
            />
            <AddEditUserModal
                open={selectedUser?.open ?? Boolean(selectedUser)}
                user={selectedUser}
                setClientSecret={setClientSecret}
                toggleModal={handleUserSelect} />
            <DeleteUserModal
                open={deleteUser?.open ?? Boolean(deleteUser)}
                user={deleteUser}
                toggleModal={handleDeleteSelect}
            />
            <ClientSuccessModal
                open={clientSecret?.open ?? Boolean(clientSecret)}
                {...clientSecret}
                toggleModal={setClientSecret}
            />
        </div>
    )
}
const calculateWidth = (props) => {
    const { scrollWidth, columnDef: { tableData: { columnOrder }, field } } = props;
    const result = {};
    if (field == 'User Management'){
        result.width = scrollWidth * .1;
        result.maxWidth = 200;
    } else if (field == 'description'){
        result.width = scrollWidth * .50;
    } else if (field == 'clientId'){
        result.width = 320;
    } else {
        result.width = scrollWidth * .15;
        result.maxWidth = 200;
    }
    return result;
}
function generateRoleColumn(title, productId) {

    return {
        title, field: title, render: rowData => <RenderRoleIcon rowData={rowData} field={title} productId={productId} />, sorting: false, filtering: false, productId
    }
};
const RenderRoleIcon = props => {
    const { rowData, field, productId } = props;
    const assignableRoles = useSelector(selectApiAssignableRoles());
    const disabled = !assignableRoles?.[productId]?.isSubscribed;
    if (disabled) {
        return (
            <span className="disabled-role"></span>
        )
    }
    return (
        <span className={`role-cell ${rowData?.displayRoles?.[field]}`}>{rowData?.displayRoles?.[field]}</span>
    )
}
const TableActions = (props) => {
    const { action, data } = props;
    let icon = null;
    switch (action?.icon) {
        case 'edit':
            icon = mdiPlaylistEdit;
            break;
        case 'delete':
            icon = mdiDeleteOutline;
            break;
        case 'add':
            return (
                <Button disableElevation disableRipple
                    variant="contained" className="primary add-user-button"
                    onClick={() => action?.onClick?.()}>
                    Add API User
                </Button>
            )
        case 'learn-more':
            return (
                <span className="link learn-more underline" onClick={() => action?.onClick?.()}>
                    Learn more about API management
                </span>
            )
    }
    return (
        <span className={`action-icon pointer`} title={action?.tooltip} onClick={() => action?.onClick?.(data)}>
            <Icon className={`${action?.icon}`} color="#828282" path={icon} size={'24px'} />
        </span>
    )
}

const TableBody = (props) => {
    const filters = useSelector(selectFilters());
    const { renderData } = props;
    const [USERS, setUsers] = useState(renderData);
    useEffect(() => {
        if (filters || renderData) {
            setUsers(renderData?.filter((u) => Object.entries(u?.displayRoles || {})?.every(([k, v]) => {
                return filters?.[k]?.has(v) ?? true;
            })))
        }
    }, [renderData, filters])

    return (
        <>
            <MTableBody {...props} renderData={USERS} />
            <caption className="table-footer subtle-text">
                <div>
                    <span></span>
                    <span>End of List</span>
                    <span>{`${USERS?.length} of ${USERS?.length}`}</span>
                </div>
            </caption>
        </>
    )
}
function TableHeader(props) {
    const { headerStyle, scrollWidth, columns, orderBy, orderDirection, onOrderChange, isAdmin } = props;
    const headers = (isAdmin ? [...columns, { title: 'Actions', action: true }] : columns).filter((c) => !c?.hidden);
    const assignableRoles = useSelector(selectApiAssignableRoles());
    return (
        <>
            <TableHead className="table-header subtext">
                <TableRow >
                    {headers?.map((c) => {

                        const index = columns?.findIndex((col) => col.title == c?.title);
                        const isSortable = c?.sorting ?? true;
                        const isAction = c?.action ?? false;
                        var width = scrollWidth / headers?.length;
                        var content = ''
                        if (isAction) {
                            content = c?.title;
                            width = 80
                        } else if (isSortable) {
                            content = <TableSortLabel
                                active={index == orderBy}
                                direction={index == orderBy ? orderDirection : 'asc'}
                                onClick={() => onOrderChange(index, orderBy == index && orderDirection == 'asc' ? 'desc' : 'asc')}
                            >
                                {c.title}
                            </TableSortLabel>
                        } else {
                            content = <FilterRole title={c.title} disabled={!assignableRoles?.[c?.productId]?.isSubscribed} />
                        }
                        return (
                            <TableCell
                                className="header-cell"
                                style={{ ...headerStyle, backgroundColor: '#EEFAFF', width, whiteSpace: 'nowrap' }}
                            >
                                {content}
                            </TableCell>
                        )
                    })}
                </TableRow>
            </TableHead>
        </>
    )
}

function FilterRole(props) {
    const { title, disabled } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const logger = useSelector(makeSelectLogger());
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        logger?.manualAddLog('click', `open-filter-${title}`);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
        logger?.manualAddLog('click', `close-filter-${title}`);
    };
    const filters = useSelector(selectFilters())

    const isFiltered = filters?.[title] ? filters?.[title].size < 3 : false;

    if (disabled) {
        return (

            <span className="disabled-header">
                <span>{title}</span>
                <LightTooltip
                    title={"Not subscribed"}
                    interactive arrow placement="top" fontSize="small">
                    <Icon path={mdiLockOutline} size={'22px'} />
                </LightTooltip>
            </span>


        )
    }
    return (
        <React.Fragment>
            <span
                className="pointer"
                onClick={handleClick}
            >
                {title}{isFiltered ? <Icon path={mdiFilter} color={"#004f6e"} style={{ marginLeft: 6 }} size={'12px'} /> : <ArrowDropDown />}
            </span>
            <Menu
                anchorEl={anchorEl}
                open={open}
                keepMounted
                onClose={handleClose}
            >
                <RoleOption label="Full Access" parent={title} />
                <RoleOption label="View Only" parent={title} />
                <RoleOption label="No Access" parent={title} />
            </Menu>
        </React.Fragment>
    )
}
function RoleOption(props) {
    const dispatch = useDispatch();
    const { label, onClick, parent } = props;
    const defaultSet = new Set(['Full Access', 'View Only', 'No Access'])
    const filters = useSelector(selectFilters()) || {
        'User Management': new Set(defaultSet),
    };
    //We maintain an internal check state to help with rendering 
    const [check, setCheck] = useState(filters[parent]?.has(label) || false);
    const logger = useSelector(makeSelectLogger());
    const handleFilter = (e, v) => {
        const productFilter = filters[e] ?? new Set();
        if (productFilter.has(v)) {
            productFilter.delete(v);
        } else {
            productFilter.add(v);
        }
        filters[e] = productFilter;
        dispatch(setApiFilters(filters));
        setCheck(filters[parent]?.has(label));
        logger?.manualAddLog('click', `update-filter-${parent}`, productFilter);
    }
    return (
        <MenuItem key={parent + label} onClick={() => { handleFilter(parent, label) }} style={{ padding: "0px 14px 0 0 " }}>
            <ListItemIcon style={{ minWidth: 30 }}>
                <Checkbox
                    disableRipple
                    disabled
                    icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon path={mdiCheckboxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    checked={check}
                />
            </ListItemIcon>
            <ListItemText>
                {label}
            </ListItemText>
        </MenuItem>
    )
}