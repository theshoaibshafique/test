/*
 * UserManager Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import ReactTable from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import {ROLES} from '../../constants.js'
import UserList from '../../components/UserManager/UserList';
import UserInfo from '../../components/UserManager/UserInfo';

import './style.scss';

import '../../../node_modules/react-table/react-table.css';

export default class UserManager extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      open: false ,
      deleteDialogOpen: false,
      currentView: 'Global',
      enableField: false,
      rolesChanged: false,
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        location: 'Site 2',
        country: 'CA',
        insight: [],
        survey: [],
        active: true,
        email: true
      },
      deleteUser: {
        name: '',
        index: ''
      },
      users : [{
        firstName: 'Magnus',
        lastName: 'Davis',
        email: 'mdavis@stmichael.ca',
        location: 'Site 1',
        country: 'CA',
        insight: ['insight_role_2'],
        survey: [],
        active: true,
        email: true,
      }, {
        firstName: 'Christopher',
        lastName: 'Harper',
        email: 'charper@stmichael.ca',
        location: 'Site 2',
        country: 'CA',
        insight: ['insight_role_3'],
        survey: ['survey_role_2'],
        active: false,
        email: false,
      }]
    };
  }

  openModal() {
    this.setState({
      open: true,
      enableField: true
    });
  }

  addUser(){
    this.state.userValue["currentUser"] = this.state.users.length;
    this.setState({
      users: [...this.state.users, this.state.userValue],
      currentView: 'User',
      enableField: false,
      open: false
    })
  }

  viewUserDetail(index) {
    let selectedUser = this.state.users[index];

    this.setState({
      userValue:{
        currentUser: index,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        country: selectedUser.country,
        email: selectedUser.email,
        location: selectedUser.location,
        insight: selectedUser.insight,
        tempInisght: selectedUser.insight,
        survey: selectedUser.survey,
        tempSurvey: selectedUser.survey,
        active: selectedUser.active,
        email: selectedUser.email,
      },
      enableField: false,
      rolesChanged: false,
      currentView: 'User'
    })
  }

  copyUserValue() {
    let currentUserValue = {...this.state.userValue};

    this.setState({
      tempUserValue: currentUserValue
    })
  }

  updateUser() {
    this.setState({currentView: 'User'})
  }

  saveUser() {
    let tempUserList = [...this.state.users];
    tempUserList[this.state.userValue.currentUser] = this.state.userValue;
    this.setState({
      users: tempUserList,
      enableField: false,
      currentView: 'Global'
    })
  }

  saveCard() {
    let tempUserList = [...this.state.users];
    tempUserList[this.state.userValue.currentUser] = this.state.userValue;
    this.setState({
      users: tempUserList,
      enableField: false
    })
  }

  cancelSaveUser() {
    this.setState({
      userValue: this.state.tempUserValue,
      enableField: false,
      rolesChanged: false
    })
  }

  deleteUser(index) {
    this.setState({
      deleteDialogOpen: true,
      deleteUser: {
        name: this.state.users[index].firstName,
        index: index
      }
    })
  }

  resetDeleteDialog() {
    this.setState({
      deleteDialogOpen: false,
      deleteUser: {
        name: '',
        index: ''
      }
    })
  }

  handleDialogCancel() {
    this.resetDeleteDialog();
  }

  handleDialogConfirm() {
    let filteredUser = [...this.state.users];
    filteredUser.splice(this.state.deleteUser.index, 1);
    this.setState({
      users: filteredUser
    })
    this.resetDeleteDialog();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  closeModal() {
    this.resetModal();
  }

  resetModal() {
    this.setState({
      open: false,
      modalStage: 1,
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        location: 'Site 2',
        country: '',
        insight: [],
        survey: [],
        active: true,
        email: true,
      },
      rolesChanged: false
    })
  }

  handleFormChange(e) {
    let currentUserValue = {...this.state.userValue};
    if (e.target.type == 'checkbox') {
      currentUserValue[e.target.name] = e.target.checked;
    } else {
      currentUserValue[e.target.name] = e.target.value;
    }
    this.setState({userValue: currentUserValue});
  }

  handleSwitch(e) {
    if (!this.state.rolesChanged) {
      this.setState({rolesChanged: true});
      this.copyUserValue();
    }

    let target = e.target.name;
    let currentUserValue = {...this.state.userValue};

    if (e.target.checked) {
      currentUserValue[target] = [...currentUserValue[target], e.target.value];
    } else {
      let filteredRolesArray = this.state.userValue[target].filter(item => item !== e.target.value);
      currentUserValue[target] = filteredRolesArray;
    }

    this.setState({
      userValue: currentUserValue
    })
  }

  goBackToGlobalView() {
    this.setState({currentView: 'Global'});
    this.resetModal();
  }

  toggleEnableField() {
    this.copyUserValue();
    this.setState({
      enableField: !this.state.enableField
    })
  }

  render() {
    const columns = [{
      Header: 'First Name',
      accessor: 'firstName' // String-based value accessors!
    }, {
      Header: 'Last Name',
      accessor: 'lastName' // String-based value accessors!
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      Header: 'Location',
      accessor: 'location'
    }, {
      Header: () => (''),
      accessor: 'edituser',
      Cell: row => (<div><FontAwesomeIcon className="SST-User-Edit" icon="edit" onClick={(e) => this.viewUserDetail(row.index)} /><FontAwesomeIcon className="SST-User-Edit" icon="trash" onClick={(e) => this.deleteUser(row.index)}/></div>)
    }]

    let currentUserViewRender;

    if (this.state.currentView === "Global")
        currentUserViewRender = <UserList
                              openModal={(e) => this.openModal()}
                              users={this.state.users}
                              enableField={this.state.enableField}
                              columns={columns}
                              open={this.state.open}
                              userValue={this.state.userValue}
                              closeModal={(e) => this.closeModal()}
                              addUser={(e) => this.addUser()}
                              handleFormChange={(e) => this.handleFormChange(e)}
                              updateUser={(e) => this.updateUser()}
                              deleteDialogOpen={this.state.deleteDialogOpen}
                              deleteUserName={this.state.deleteUser.name}
                              handleCancel={()=>this.handleDialogCancel()}
                              handleConfirm={()=>this.handleDialogConfirm()}
                            />
    else
      currentUserViewRender = <UserInfo
                            roles={ROLES}
                            userValue={this.state.userValue}
                            tempUserValue={this.state.tempUserValue}
                            goBackToGlobalView={() => this.goBackToGlobalView()}
                            handleSwitch={(e) => this.handleSwitch(e)}
                            handleFormChange={(e) => this.handleFormChange(e)}
                            toggleEnableField={() => this.toggleEnableField()}
                            saveUser={() => this.saveUser()}
                            saveCard={() => this.saveCard()}
                            cancelSaveUser={() => this.cancelSaveUser()}
                            enableField={this.state.enableField}
                            rolesChanged={this.state.rolesChanged}
                          />
    return (
      <section className="User-Manager">
        <Helmet>
          <title>User Manager</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <div className="Package-Header-Wrapper">
          <div className="Package-Header-Title light-green bold capitalize">
            User Management
          </div>
        </div>
        {currentUserViewRender}
      </section>
    );
  }
}