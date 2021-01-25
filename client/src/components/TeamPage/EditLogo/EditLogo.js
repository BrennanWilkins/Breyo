import React from 'react';
import classes from './EditLogo.module.css';
import PropTypes from 'prop-types';
import { FileInput } from '../../UI/Inputs/Inputs';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import { changeTeamLogo, removeTeamLogo } from '../../../store/actions';
import { connect } from 'react-redux';
import ModalContainer from '../../UI/ModalContainer/ModalContainer';

const EditLogo = props => (
  <ModalContainer className={classes.Container} close={props.close} title="Change Logo">
    {props.userIsAdmin ?
      <>
        <FileInput title="Upload a new logo" change={img => { props.changeLogo(img, props.teamID); props.close(); }} />
        {!!props.logo && <div className={classes.RemoveBtn}>
        <ActionBtn clicked={() => { props.removeLogo(props.teamID); props.close(); }}>Remove logo</ActionBtn>
        </div>}
      </>
      : <div className={classes.NotAdmin}>You must be an admin of this team to change the logo.</div>}
  </ModalContainer>
);

EditLogo.propTypes = {
  teamID: PropTypes.string.isRequired,
  logo: PropTypes.string,
  close: PropTypes.func.isRequired,
  changeLogo: PropTypes.func.isRequired,
  removeLogo: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
  changeLogo: (img, teamID) => dispatch(changeTeamLogo(img, teamID)),
  removeLogo: teamID => dispatch(removeTeamLogo(teamID))
});

export default connect(null, mapDispatchToProps)(EditLogo);
