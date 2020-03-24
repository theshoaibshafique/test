import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
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
import Snackbar from '@material-ui/core/Snackbar';

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
      userList: [],
      open: false,
      currentView: 'add',
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        department: '',
        country: '',
        preferredLanguage: 'en-US',
        active: true,
        permissions: [],
        id: ''
      },
      snackBarOpen: false,
      deleteDialogOpen: false,
      errorMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.',
      errorMsgVisible: false,
      errorMsgEmailVisible: false
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
    });

    this.props.notLoading();
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
        if (result != null) {
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
                department: rowData.departmentName,
                country: rowData.country,
                preferredLanguage: rowData.preferredLanguage,
                active: rowData.active,
                permissions: permission,
                id: rowData.tableData.id,
                isLoaded:true
              }
            });
          }
          
        } else {
          // send error to modal
          this.setState({ errorMsgVisible: true });
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
        department: '',
        country: '',
        preferredLanguage: 'en-US',
        active: true,
        permissions: [],
        id: ''
      },
      errorMsgVisible: false,
      errorMsgEmailVisible: false
    })
  };

  addUser(){
    this.props.loading();

    let jsonBody = {
      "firstName": this.state.userValue.firstName,
      "lastName": this.state.userValue.lastName,
      "email": this.state.userValue.email,
      "title": this.state.userValue.title,
      "departmentName": this.state.userValue.department,
      "preferredLanguage": 'en-US',
      "active": true,
      "sendEmail": true
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'post', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error') {
        this.setState({ errorMsgVisible: true, errorMsgEmailVisible: false });
      } else if (result === 'conflict') {
        this.setState({ errorMsgEmailVisible: true, errorMsgVisible: false });
      } else {
        // add roles
        let jsonBody;
        
        if (this.state.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": result,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // User management
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });

          jsonBody = {
            "userName": result,
            "appName": '5E451021-9E5B-4C5D-AC60-53109DAE7853',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // Location
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });

          jsonBody = {
            "userName": result,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody) // Insights
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });
        }

        let rolesNames = [];
        if (this.state.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M View") >= 0 || 
            this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
                rolesNames.push('Enhanced M&M View');
        }

        if (this.state.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0 || 
            this.props.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
                rolesNames.push('Enhanced M&M Edit');
        }

        if (rolesNames.length > 0) {
          jsonBody = {
            "userName": result,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": rolesNames
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody)
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.setState({ errorMsgVisible: true });
            }
          });
        }

        if (!this.state.errorMsgVisible && !this.state.errorMsgEmailVisible) {
          this.refreshGrid();
        }
      }
    })
    this.props.notLoading();
  };

  refreshGrid() {
    this.setState({
      userList: [...this.state.userList, this.state.userValue],
      currentView: 'add',
      open: false
    })
  };

  updateGrid(id) {
    let newState = Object.assign({}, this.state);
    newState.userList[id].active = !this.state.userValue.active;

    this.setState({
      newState,
      currentView: 'add'
    })
  };

  updateGridEdit(id) {
    let newState = Object.assign({}, this.state);
    newState.userList[id].firstName = this.state.userValue.firstName;
    newState.userList[id].lastName = this.state.userValue.lastName;
    newState.userList[id].email = this.state.userValue.email;
    newState.userList[id].title = this.state.userValue.title;
    newState.userList[id].permissions = this.state.userValue.permissions;

    this.setState({
      newState,
      currentView: 'add',
      open: false
    })
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

  passwordResetLink() {
    let jsonBody = {
      "userName": this.state.userValue.currentUser
    }

    globalFuncs.genericFetchWithNoReturnMessage(process.env.USERMANAGEMENTRESET_API, 'PATCH', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error' || result === 'conflict') {
        // send error to modal
        this.setState({ errorMsgVisible: true });
      } else {
        // show toast for success
        this.setState({
          snackBarOpen: true
        })
      }
    })
  };

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
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

  render() {
    return (
      <section className="user-management-page">
        <div className="header page-title">
          <div><span className="pad">User Management</span><Button variant="contained" className="primary" onClick={(e) => this.openModal(e, 'add', '')}>Add</Button> </div>
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
              pageSizeOptions: [ 5, 10, 25 ,50, 75, 100 ],
              search: true,
              paging: true,
              searchFieldAlignment: 'left',
              searchFieldStyle:{marginLeft:-24}
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
          addUser={() => this.addUser()}
          handleFormChange={(e) => this.handleFormChange(e)}
          handleClose={() => this.handleClose()}
          currentView={this.state.currentView}
          passwordResetLink={() => this.passwordResetLink()}
          deleteUser={() => this.deleteUser()}
          errorMsg={this.state.errorMsg}
          errorMsgVisible={this.state.errorMsgVisible}
          errorMsgEmailVisible={this.state.errorMsgEmailVisible}
          refreshGrid={() => this.refreshGrid()}
          updateGridEdit={(id) => this.updateGridEdit(id)}
        />

        <DeleteModal
          deleteDialogOpen={this.state.deleteDialogOpen}
          handleClose={() => this.handleClose()}
          userValue={this.state.userValue}
          errorMsg={this.state.errorMsg}
          updateGrid={(id) => this.updateGrid(id)}
        />

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={() => this.handleCloseSnackBar()}
          message="Password Reset Email Sent"
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseSnackBar()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </section>
    );
  }
}