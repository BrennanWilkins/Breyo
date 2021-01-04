import React, { useState } from 'react';
import classes from './ChangeAvatar.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChangeAvatarModal from './ChangeAvatarModal';
import { instance as axios } from '../../../../axios';
import { deleteAvatar, changeAvatar } from '../../../../store/actions';

const ChangeAvatar = props => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPic, setSelectedPic] = useState(props.avatar || null);
  const [picSelected, setPicSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const errHandler = () => {
    setLoading(false);
    setErr(true);
  };

  const changeAvatarHandler = async img => {
    try {
      if (img === 'current') {
        setPicSelected(false);
        return setSelectedPic(props.avatar);
      }
      if (img === null) {
        setErr(false);
        setSelectedPic(null);
        setPicSelected(false);
        await axios.delete('/user/avatar');
        return props.deleteAvatar();
      }

      setSelectedPic(URL.createObjectURL(img));
      setPicSelected(true);
      setLoading(true);
      setErr(false);
      const reader = new FileReader();
      reader.readAsDataURL(img);

      reader.onloadend = () => {
        axios.post('/user/avatar', { avatar: reader.result }).then(res => {
          props.changeAvatar(res.data.url);
          setLoading(false);
        }).catch(err => { return errHandler(); });
      };
      reader.onerror = () => { return errHandler(); }
    } catch (err) { errHandler(); }
  };

  return (
    <div>
      <div className={classes.Title}>Avatar</div>
      <div className={classes.NameIcon} onClick={() => setShowModal(true)}>
        {picSelected ? <img src={selectedPic} alt="" /> : (props.avatar && props.avatar === selectedPic) ? <img src={props.avatar} alt="" /> : props.fullName[0]}
        <div className={classes.ChangeBtn}>Change</div>
      </div>
      {showModal && <ChangeAvatarModal close={() => setShowModal(false)} err={err} avatar={props.avatar}
      setPic={changeAvatarHandler} fullName={props.fullName} selectedPic={selectedPic} loading={loading} picSelected={picSelected} />}
    </div>
  );
};

ChangeAvatar.propTypes = {
  fullName: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName,
  avatar: state.auth.avatar
});

const mapDispatchToProps = dispatch => ({
  deleteAvatar: () => dispatch(deleteAvatar()),
  changeAvatar: url => dispatch(changeAvatar(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAvatar);
