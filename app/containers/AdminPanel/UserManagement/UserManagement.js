import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import LoadingOverlay from 'react-loading-overlay';
import globalFuncs from 'utils/global-functions';
import './style.scss';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import UserModal from './Modal/UserModal/UserModal';
import DeleteModal from './Modal/DeleteModal';


export default class UserManagement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userList: [],
      roleNames:[],
      open: false,
      currentView: 'add',
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        facilityName: this.props.facilityName,
        country: '',
        preferredLanguage: 'en-US',
        active: true,
        permissions: [],
        id: ''
      },
      deleteDialogOpen: false,
      errorMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.',
      errorMsgVisible: false,
      errorMsgEmailVisible: false,
      fieldErrors:{}
    }
  }

  async componentDidMount() {
    await globalFuncs.genericFetch(`${process.env.USER_API}profiles`, 'get', this.props.userToken, {})
    .then(result => {
      if (result) {       
        this.setState({
          userList: result
        });
      } else {
        this.setState({
          userList: []
        });
      }
      this.notLoading();
    });
    this.getRoles();
  };

  componentDidUpdate(){
    // FOR THE LOGS
    const search = document.getElementsByClassName('MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd');
    if (search.length){
      search[0].classList.add("log-input");
    }
    const {logger} = this.props;
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
  }

  openModal(e, view, rowData) {
    this.setState({
      errorMsgVisible: false,
      errorMsgEmailVisible: false
    })
    const {logger} = this.props;
    if (rowData) {
      this.setState({
        lastRequestedUserName: rowData.userName
      })

      const userData = {
        currentUser: rowData.userName,
          firstName: rowData.firstName,
          lastName: rowData.lastName,
          email: rowData.email,
          title: rowData.title,
          facilityName: rowData.facilityName,
          country: rowData.country,
          preferredLanguage: rowData.preferredLanguage,
          isActive: rowData.isActive,
          permissions: rowData.roles || rowData.permissions,
          id: rowData.tableData.id,
      };
      logger && logger.manualAddLog('click', `open-${view}-modal`, userData);
      this.setState({
        userValue: {
          ...userData,
          isLoaded:true
        }
      });

    } else {
      logger && logger.manualAddLog('click', `open-${view}-modal`);
    }

    this.setState({
      open: true,
      currentView: view,
    });
  };

  closeModal() {
    this.resetModal();
  };

  resetModal() {
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `close-${this.state.currentView}-modal`);
    this.setState({
      open: false,
      currentView: 'add',
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        country: '',
        preferredLanguage: 'en-US',
        isActive: true,
        permissions: [],
        id: ''
      },
      lastRequestedUserName: '',
      errorMsgVisible: false,
      errorMsgEmailVisible: false,
      fieldErrors:{}
    })
  };

  isFormValid(){
    var errors = {};

    if (!this.state.userValue.firstName){
      errors.firstName = 'Please enter a first name'
    }

    if (!this.state.userValue.lastName){
      errors.lastName = 'Please enter a last name'
    }

    if (!this.state.userValue.email){
      errors.email = 'Please enter a valid email address'
    }
    
    if (!this.state.userValue.title){
      errors.title = 'Please enter a title'
    }

    this.setState({fieldErrors: errors});
    return errors; //Object.keys(errors).length === 0;
  }

  
  loading() {
    this.setState({
      isLoading: true
    });
  }

  notLoading() {
    this.setState({
      isLoading: false
    });
  }

  refreshGrid(userName) {
    let newUser = this.state.userValue;
    newUser.userName = userName;
    this.setState({
      userList: [...this.state.userList, newUser],
      currentView: 'add',
      open: false
    })
    this.handleClose()
  };

  updateGrid(id) {
    let newState = Object.assign({}, this.state);
    newState.userList[id].isActive = !this.state.userValue.isActive;

    this.setState({
      newState,
      currentView: 'add'
    })
  };

  updateGridEdit(id,userValue) {
    let newState = Object.assign({}, this.state);
    newState.userList[id].firstName = userValue.firstName;
    newState.userList[id].lastName = userValue.lastName;
    newState.userList[id].email = userValue.email;
    newState.userList[id].title = userValue.title;
    newState.userList[id].permissions = userValue.permissions;
    newState.userValue.isLoaded = false;
    this.setState({
      newState,
      currentView: 'add',
      open: false
    })
    this.handleClose()
  };

  handleFormChange(e) {
    let currentUserValue = {...this.state.userValue};
    const {logger} = this.props;
    if (e.target.type == 'checkbox') {
      let targetIndex = currentUserValue["permissions"].indexOf(e.target.value);
      if (targetIndex < 0) {
        currentUserValue["permissions"].push(e.target.value);
        logger && logger.manualAddLog('onchange', `user-update-permissions-add`, e.target.value);
      } else {
        currentUserValue["permissions"].splice(targetIndex, 1);
        logger && logger.manualAddLog('onchange', `user-update-permissions-remove`, e.target.value);
      }
    } else {
      currentUserValue[e.target.name] = e.target.value;
      logger && logger.manualAddLog('onchange', `user-update-${e.target.name}`, e.target.value);
    }
    this.setState({userValue: currentUserValue});
  };

  handleClose = () => {
    this.setState({ open: false, deleteDialogOpen: false, errorMsgVisible: false, errorMsgEmailVisible: false });
    this.resetModal();
  };

  deleteUser() {
    // pop up modal asking to confirm
    this.setState({
      open: false,
      deleteDialogOpen: true, 
      errorMsgVisible: false,
      errorMsgEmailVisible: false
    })
  };

  getRoles(){
    globalFuncs.genericFetch(process.env.USER_API + "subscriptions", 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else if (result) {
          this.setState({roleNames:result || []})
        }
      });
  }

  render() {
    let allPageSizeOptions = [ 5, 10, 25 ,50, 75, 100 ];
    let pageSizeOptions = [];
    allPageSizeOptions.some(a => (pageSizeOptions.push(Math.min(a,this.state.userList.length)), a > this.state.userList.length));
    return (
      <LoadingOverlay
      active={this.state.isLoading}
      spinner
      text='Loading your content...'
      className="Overlay"
      >
      <div className="user-management-page">
        <div className="add-user-button">
          <Button id="add-user" variant="outlined" className="primary" onClick={(e) => this.openModal(e, 'add', '')}>Add User</Button>
        </div>

        <div>
          <MaterialTable
            title=""
            columns={[
              { title: this.generateTitle('User Name'), field: 'userName', hidden: true },
              { title: this.generateTitle('First Name'), field: 'firstName', defaultSort: 'asc' },
              { title: this.generateTitle('Last Name'), field: 'lastName' },
              { title: this.generateTitle('Email'), field: 'email' },
              { title: this.generateTitle('Title'), field: 'title'}
            ]}
            options={{ 
              pageSize: 10,
              pageSizeOptions: pageSizeOptions,
              search: true,
              paging: true,
              searchFieldAlignment: 'left',
              searchFieldStyle:{marginLeft:-24},
              thirdSortClick: false,
              draggable:false
            }}
            data={this.state.userList}
            icons={this.getTableIcons()}
            onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
          />
        </div>
        
        <UserModal
          open={this.state.open}
          userValue={this.state.userValue}
          closeModal={() => this.closeModal()}
          handleFormChange={(e) => this.handleFormChange(e)}
          handleClose={() => this.handleClose()}
          currentView={this.state.currentView}
          deleteUser={() => this.deleteUser()}
          fieldErrors={this.state.fieldErrors}
          errorMsg={this.state.errorMsg}
          errorMsgVisible={this.state.errorMsgVisible}
          errorMsgEmailVisible={this.state.errorMsgEmailVisible}
          refreshGrid={(userName) => this.refreshGrid(userName)}
          updateGridEdit={(id,userValue) => this.updateGridEdit(id,userValue)}
          isFormValid={() => this.isFormValid()}
          roleNames={this.state.roleNames}
        />

        <DeleteModal
          deleteDialogOpen={this.state.deleteDialogOpen}
          handleClose={() => this.handleClose()}
          userValue={this.state.userValue}
          errorMsg={this.state.errorMsg}
          updateGrid={(id) => this.updateGrid(id)}
          roleNames={this.state.roleNames}
        />

      </div>
      </LoadingOverlay>
    );
  }

  // LOG HELPERS
  getTableIcons(){
    const tableIcons = {
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} onClick={() => this.logClick('first-page')} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} onClick={() => this.logClick('last-page')}/>),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} onClick={() => this.logClick('next-page')}/>),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} onClick={() => this.logClick('previous-page')}/>),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} onClick={() => this.logClick('clear-search')}/>),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
    };
    return tableIcons
  }
  logClick(key){
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `${key}`);
  }

  sortClick(key){
    //if element exists we're descending
    var element = document.querySelectorAll('.MuiTableSortLabel-active .MuiTableSortLabel-iconDirectionAsc');
    var titleElement = document.querySelectorAll('.MuiTableSortLabel-active');
    //Check if its the same title
    let isSameTitle = titleElement.length && key == titleElement[0].textContent;
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `sort-user-list-${key}`, element.length && isSameTitle ? 'desc' : 'asc');
  }
  generateTitle(title){
    // Generate a title element for the logs
    return (
      <div onClick={() => this.sortClick(title)}>{title}</div>
    )
  }
}