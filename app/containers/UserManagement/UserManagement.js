import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import LoadingOverlay from 'react-loading-overlay';
import globalFuncs from '../../utils/global-functions';
import './style.scss';

import UserModal from '../../components/Modal/UserModal/UserModal';
import DeleteModal from '../../components/Modal/DeleteModal';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

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
    await globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'get', this.props.userToken, {})
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

  openModal(e, view, rowData) {
    this.setState({
      errorMsgVisible: false,
      errorMsgEmailVisible: false
    })

    if (rowData) {
      this.setState({
        lastRequestedUserName: rowData.userName
      })
      // get the user roles for edit
      globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API + rowData.userName, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          // send error to modal
          this.setState({ errorMsgVisible: true });
        } else {
          const permission = []
          result.map(userRole => {
            if (userRole.roleNames && userRole.roleNames.length) {
              userRole.roleNames.map((role) => {
                permission.push(userRole.appName + '_' + role);
              })
            }
          });
          //Only set the state of the most recently retrieved user (fixes bug when of rapidly swapping between popups)
          if (this.state.lastRequestedUserName == rowData.userName){
            this.setState({
              userValue: {
                currentUser: rowData.userName,
                firstName: rowData.firstName,
                lastName: rowData.lastName,
                email: rowData.email,
                title: rowData.title,
                facilityName: rowData.facilityName,
                country: rowData.country,
                preferredLanguage: rowData.preferredLanguage,
                active: rowData.active,
                permissions: permission,
                id: rowData.tableData.id,
                isLoaded:true
              }
            });
          }
        }
      });
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
        active: true,
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
    newState.userList[id].active = !this.state.userValue.active;

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
    if (e.target.type == 'checkbox') {
      let targetIndex = currentUserValue["permissions"].indexOf(e.target.value);
      if (targetIndex < 0) {
        currentUserValue["permissions"].push(e.target.value);
      } else {
        currentUserValue["permissions"].splice(targetIndex, 1);
      }
    } else {
      currentUserValue[e.target.name] = e.target.value;
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
    globalFuncs.genericFetch(process.env.USERMANAGEMENTROLES_API + "/35840EC2-8FA4-4515-AF4F-D90BD2A303BA", 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else if (result) {
          this.setState({roleNames:result.roleNames || []})
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
      <section className="user-management-page">
        <div className="header page-title">
          <div><span className="pad">User Management</span><Button variant="outlined" className="primary" onClick={(e) => this.openModal(e, 'add', '')}>Add</Button> </div>
        </div>

        <div>
          <MaterialTable
            title=""
            columns={[
              { title: 'User Name', field: 'userName', hidden: true },
              { title: 'First Name', field: 'firstName' },
              { title: 'Last Name', field: 'lastName' },
              { title: 'Email', field: 'email' },
              { title: 'Title', field: 'title'}
            ]}
            options={{ 
              pageSize: 10,
              pageSizeOptions: pageSizeOptions,
              search: true,
              paging: true,
              searchFieldAlignment: 'left',
              searchFieldStyle:{marginLeft:-24},
              draggable:false
            }}
            data={this.state.userList}
            icons={tableIcons}
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
        />

      </section>
      </LoadingOverlay>
    );
  }
}