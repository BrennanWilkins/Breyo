import React, { useRef } from 'react';
import classes from './EditLogo.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import { FileInput } from '../../UI/Inputs/Inputs';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import { changeTeamLogo, removeTeamLogo } from '../../../store/actions';
import { connect } from 'react-redux';

const EditLogo = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle close={props.close} title="Change Logo" />
      {props.userIsAdmin ?
        <>
          <FileInput title="Upload a new logo" change={img => { props.changeLogo(img, props.teamID); props.close(); }} />
          {!!props.logo && <div className={classes.RemoveBtn}>
          <ActionBtn clicked={() => { props.removeLogo(props.teamID); props.close(); }}>Remove logo</ActionBtn>
          </div>}
        </>
        : <div className={classes.NotAdmin}>You must be an admin of this team to change the logo.</div>}
    </div>
  );
};

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
