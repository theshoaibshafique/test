import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import UserFields from '../UserFields/UserFields';

class UserInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let insightSwitch = this.props.roles.INSIGHT.map((role) => {
      return <ListItem key={role}>
              <ListItemText primary={role} />
              <ListItemSecondaryAction>
                <Switch
                  name="insight"
                  value={role}
                  onChange={this.props.handleSwitch}
                  checked={this.props.userValue.insight.includes(role)}
                />
              </ListItemSecondaryAction>
            </ListItem>
    });

    let surveySwitch = this.props.roles.SURVEY.map((role) => {
      return <ListItem key={role}>
              <ListItemText primary={role} />
              <ListItemSecondaryAction>
                <Switch
                  name="survey"
                  value={role}
                  onChange={this.props.handleSwitch}
                  checked={this.props.userValue.survey.includes(role)}
                />
              </ListItemSecondaryAction>
            </ListItem>
    });

    let cardButton = (this.props.enableField) ?
      <div>
        <Button onClick={this.props.cancelSaveUser} size="small">Cancel</Button>
        <Button onClick={this.props.saveCard} size="small">Save</Button>
      </div>
      :
      <Button onClick={this.props.toggleEnableField} size="small">Edit</Button>;

    let rolesButton = (this.props.rolesChanged) ?
      <div>
        <Button className="secondary" onClick={this.props.cancelSaveUser}>Discard</Button>
        <Button className="primary" onClick={this.props.saveUser}>Save</Button>
      </div>
      :
      <Button variant="contained" className="primary" onClick={this.props.goBackToGlobalView}>Back</Button>;
    return (

      <div className="User-Single-View">
        <Card className="User-Info">
          <CardContent className="dark-blue">
              User Info
              <UserFields
                userValue={this.props.userValue}
                enableField={this.props.enableField}
                handleFormChange={this.props.handleFormChange}
              />
          </CardContent>
          <CardActions className="flex right-center">
            {cardButton}
          </CardActions>
        </Card>
        <Card className="User-Info">
          <CardContent>
            <List subheader={<ListSubheader>Insight Roles</ListSubheader>}>
              {insightSwitch}
            </List>
          </CardContent>
        </Card>
        <Card className="User-Info">
          <CardContent>
            <List subheader={<ListSubheader>Survey Roles</ListSubheader>}>
              {surveySwitch}
            </List>
          </CardContent>
        </Card>
        <div className="Roles-Button-Row right-align">
          {rolesButton}
        </div>
      </div>
    );
  }
}

export default UserInfo;
