import React, { useState } from 'react';
import classes from './AccountSettings.module.css';
import ChangePassModal from './ChangePassModal/ChangePassModal';
import DeleteAccntModal from './DeleteAccntModal/DeleteAccntModal';
import ChangeAvatar from './ChangeAvatar/ChangeAvatar';

const AccountSettings = props => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className={classes.Container}>
      <ChangeAvatar />
      <div className={classes.Option} onClick={() => setShowPasswordModal(true)}>Change Password</div>
      <div className={classes.Option} onClick={() => setShowDeleteModal(true)}>Delete my account</div>
      {showPasswordModal && <ChangePassModal close={() => setShowPasswordModal(false)} />}
      {showDeleteModal && <DeleteAccntModal close={() => setShowDeleteModal(false)} />}
    </div>
  );
};

export default AccountSettings;
