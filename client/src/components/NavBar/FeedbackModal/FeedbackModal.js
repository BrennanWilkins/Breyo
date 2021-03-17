import React, { useState, useRef, useEffect } from 'react';
import classes from './FeedbackModal.module.css';
import PropTypes from 'prop-types';
import { instance as axios } from '../../../axios';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtnCircle } from '../../UI/Buttons/Buttons';
import { Input } from '../../UI/Inputs/Inputs';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import TextArea from 'react-textarea-autosize';
import { isEmail } from '../../../utils/authValidation';

const FeedbackModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowErrMsg(false);
    setSentSuccess(false);
  }, [email, msg]);

  const sendFeedback = () => {
    if (!msg) {
      setErrMsg('Please enter a message before sending.');
      return setShowErrMsg(true);
    }
    if (email && !isEmail(email)) {
      setErrMsg('Please enter a valid email address.');
      return setShowErrMsg(true);
    }
    if (msg.length > 1000) { return; }
    setShowErrMsg(false);
    setIsLoading(true);
    axios.post('/auth/feedback', { email, msg }).then(res => {
      setSentSuccess(true);
      setIsLoading(false);
    }).catch(err => {
      setErrMsg('There was an error while sending your feedback.');
      setShowErrMsg(true);
      setIsLoading(false);
    });
  };

  return (
    <div className={`StyledScrollbar ${classes.Container}`} ref={modalRef}>
      <h3 className={classes.Title}>Send Feedback<CloseBtnCircle close={props.close} /></h3>
      <p className={classes.SubTitle}>If you would like me to get back to you, please enter your email below.</p>
      <div className={classes.Content}>
        <label>
          <div className={classes.Label}>Email <span>Optional</span></div>
          <Input className={classes.Input} value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <TextArea minRows="5" maxRows="15" className={classes.TextArea} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Leave your message here" />
        <ActionBtn className={classes.SendBtn} disabled={isLoading} clicked={sendFeedback}>Send Message</ActionBtn>
        <div className={showErrMsg ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
        {sentSuccess && <div className={classes.SendSuccess}>Your message was sent! Thanks for your feedback.</div>}
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default FeedbackModal;
