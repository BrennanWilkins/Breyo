import React, { useState } from 'react';
import classes from './Comment.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../../UI/Buttons/Buttons';
import Commenter from '../../../../UI/Action/Commenter/Commenter';
import DeleteModal from './DeleteModal/DeleteModal';
import { connect } from 'react-redux';
import { deleteComment, updateComment, toggleCommentLike } from '../../../../../store/actions';
import EditComment from './EditComment/EditComment';
import formatDate from '../../../../../utils/formatDate';

const Comment = props => {
  const [showCommenter, setShowCommenter] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const deleteHandler = () => {
    setShowDeleteModal(false);
    props.deleteComment(props.commentID);
  };

  const editHandler = msg => {
    if (!msg || msg.length > 400) { return; }
    setShowEdit(false);
    if (msg === props.msg) { return; }
    props.updateComment(msg, props.commentID);
  };

  const userLiked = props.likes ? props.likes.includes(props.userEmail) : null;
  const likeLength = props.likes ? props.likes.length : null;

  return (
    <><div className={classes.Comment}>
      <span className={classes.AccountInfo}>
        <AccountBtn className={classes.AccountBtn} avatar={props.avatar} clicked={() => setShowCommenter(true)}>{props.fullName[0]}</AccountBtn>
        {showCommenter && <Commenter close={() => setShowCommenter(false)} email={props.email} fullName={props.fullName} avatar={props.avatar} />}
      </span>
      <div className={classes.CommentDetail}>
        <div>
          <span className={classes.FullName}>{props.fullName}</span>
          <span className={classes.Date}>{formatDate(props.date)}</span>
        </div>
        {!showEdit && <div className={classes.Msg}>{props.msg}</div>}
        {showEdit && <EditComment msg={props.msg} close={() => setShowEdit(false)} edit={msg => editHandler(msg)} />}
      </div>
    </div>
    {!showEdit &&
      <div className={classes.Btns}>
        {props.likes && <span role="img" aria-label="Like Comment" onClick={() => props.toggleCommentLike(props.commentID)} title={userLiked ? 'Unlike this comment' : 'Like this comment'}
          className={`${classes.LikeBtn} ${likeLength ? classes.LikeBtnFilled : ''} ${userLiked ? classes.LikeBtnActive : ''}`}>
          &#128077;{!!likeLength && <span>{likeLength}</span>}
        </span>}
        {props.userComment && <>
        <span className={classes.Btn} onClick={() => setShowEdit(true)}>Edit</span>
        <span className={classes.Btn} onClick={() => setShowDeleteModal(true)}>Delete</span>
        {showDeleteModal && <DeleteModal close={() => setShowDeleteModal(false)} delete={deleteHandler} />}</>}
      </div>
    }</>
  );
};

Comment.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  commentID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  userComment: PropTypes.bool.isRequired,
  deleteComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  avatar: PropTypes.string,
  likes: PropTypes.array,
  userEmail: PropTypes.string,
  toggleCommentLike: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  deleteComment: commentID => dispatch(deleteComment(commentID)),
  updateComment: (msg, commentID) => dispatch(updateComment(msg, commentID)),
  toggleCommentLike: commentID => dispatch(toggleCommentLike(commentID))
});

export default connect(null, mapDispatchToProps)(Comment);
