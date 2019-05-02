import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import GameId from '../GameId';
import TeamRow from './TeamRow';

import './styles/PickTeams.css';

class PickTeamsComponent extends Component {

  renderTeams() {
    return this.props.teams.map(team => (
      <TeamRow
        key={team.uid}
        name={team.name}
        playerCount={team.playerCount}
        selected={this.props.selectedTeam === team.uid}
        onClick={() => this.props.selectTeam(team.uid)}
      />
    ));
  }

  render() {
    return (
      <div className="PickTeams">
        <GameId gameId={this.props.gameId} />

        <h1>Pick Teams!</h1>

        <div className="TeamNames">
          <div className="TeamNamesHeader">
            <span>Join Team:</span>
            <span># of players</span>
          </div>

          {this.renderTeams()}
        </div>

        <div className="PickTeamsAddTopicsButton">
          <Button
            variant="contained"
            onClick={() => this.props.actionButtonClicked()}
            disabled={!this.props.actionButtonEnabled}
          >
            {this.props.actionButtonTitle}
          </Button>
        </div>
      </div>
    );
  }
}

export default PickTeamsComponent;