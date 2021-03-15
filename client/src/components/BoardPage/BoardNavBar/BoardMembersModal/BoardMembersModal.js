import React, { useState, useEffect, useRef } from 'react';
import classes from './BoardMembersModal.module.css';
import navClasses from '../BoardNavBar.module.css';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { useModalToggle, useModalPos } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { Input } from '../../../UI/Inputs/Inputs';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import MemberModalContent from '../MemberModal/MemberModalContent';
import { BackBtn } from '../../../UI/Buttons/Buttons';

const BoardMembersModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [shownMember, setShownMember] = useState(null);
  const [showPermission, setShowPermission] = useState(false);

  useEffect(() => {
    if (searchQuery) { setFilteredMembers(props.members.filter(member => member.fullName.toLowerCase().includes(searchQuery.toLowerCase()))); }
  }, [searchQuery, props.members]);

  const backHandler = () => {
    if (showPermission) { return setShowPermission(false); }
    setShownMember(null);
  };

  const members = searchQuery ? filteredMembers : props.members;

  return (
    <div ref={modalRef} className={`StyledScrollbar ${classes.Container}`}>
      <ModalTitle title={showPermission ? 'Change Permissions' : shownMember ? 'Member' : 'Board Members'} close={props.close} />
      {shownMember && <div className={classes.BackBtn}><BackBtn back={backHandler} /></div>}
      {shownMember ?
        <MemberModalContent showPermission={showPermission} setShowPermission={() => setShowPermission(true)} {...shownMember} adminCount={props.adminCount} />
        :
        <>
          <Input className={classes.Input} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search members by name" />
          <div className={classes.Members}>
            {members.map(member => (
              <AccountBtn key={member.email} className={navClasses.AccountBtn} isAdmin={member.isAdmin} avatar={member.avatar}
               title={member.fullName} clicked={() => setShownMember(member)}>
                {member.fullName[0]}
              </AccountBtn>
            ))}
          </div>
        </>
      }
    </div>
  );
};

BoardMembersModal.propTypes = {
  members: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired,
  adminCount: PropTypes.number.isRequired
};

export default BoardMembersModal;
