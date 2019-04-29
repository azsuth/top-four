import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import PickTeams from './PickTeams';
import requireGame from './requireGame';

import { teamNameChanged, addTeam, selectTeam, addTopics } from '../actions';

class PickTeamsContainer extends Component {
  constructor(props) {
    super(props);

    this.teamNameChanged = this.teamNameChanged.bind(this);
    this.addTopics = this.addTopics.bind(this);
    this.addTeam = this.addTeam.bind(this);
  }

  teamNameChanged(event) {
    this.props.teamNameChanged(event.target.value);
  }

  addTopics() {
    this.props.addTopics(this.props.history);
  }

  addTeam() {
    this.props.addTeam(this.props.teamName);
  }

  render() {
    const {
      teamName,
      addTeamEnabled,
      teams,
      selectedTeam,
      addTopicsEnabled,
      selectTeam
    } = this.props;

    const {
      teamNameChanged,
      addTopics,
      addTeam
    } = this;

    return (
      <PickTeams 
        { ... {
          teamName,
          addTeamEnabled,
          teams,
          selectedTeam,
          addTopicsEnabled,
          teamNameChanged,
          addTeam,
          selectTeam,
          addTopics
        }}
      />
    )
  }
}

const teamsAndPlayerCounts = ({ teams, players }) => {
  const teamCounts = _.countBy(players, 'teamUid');
  const withPlayerCount = _.reduce(
    teams,
    (result, team, teamUid) => ({
      ...result,
      [teamUid]: { ...team, playerCount: teamCounts[teamUid] || 0 }
    }),
    {}
  );

  return _.map(withPlayerCount, (val, uid) => ({ ...val, uid }));
};

const selectedTeam = ({ players, playerUid }) => {
  const currentPlayer = players[playerUid];
  return (currentPlayer || {}).teamUid;
};

const mapStateToProps = ({ PickTeams, Game }) => ({
  teamName: PickTeams.teamName,
  addTeamEnabled: PickTeams.teamName,
  teams: teamsAndPlayerCounts(Game),
  selectedTeam: selectedTeam(Game),
  addTopicsEnabled: !!selectedTeam(Game)
});

export default connect(
  mapStateToProps,
  {
    teamNameChanged,
    addTeam,
    selectTeam,
    addTopics
  }
)(requireGame(PickTeamsContainer));