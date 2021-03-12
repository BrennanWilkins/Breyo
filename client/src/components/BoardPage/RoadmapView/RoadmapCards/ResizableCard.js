import React, { useState, useLayoutEffect, useRef } from 'react';
import classes from './RoadmapCard.module.css';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './ReactResizable.css';
import { resizeCardHandler } from '../../../../store/actions';

const RoadmapCard = props => {
  const [cardStyles, setCardStyles] = useState({ left: props.style.left, width: props.style.width });
  const history = useHistory();
  const cardRef = useRef();

  useLayoutEffect(() => setCardStyles({ ...props.style }), [props.style]);

  const showCardHandler = () => {
    history.push(`/board/${props.boardID}/l/${props.listID}/c/${props.cardID}`);
  };

  const resizeStartHandler = e => {
    document.documentElement.style.cursor = 'col-resize';
  };

  const resizeStopHandler = e => {
    document.documentElement.style.cursor = 'default';
    // dont show card details modal if currently resizing
    e.stopPropagation();

    const payload = {
      boardID: props.boardID,
      cardID: props.cardID,
      listID: props.listID,
      dateWidth: props.dateWidth,
      oldLeft: props.style.left,
      oldWidth: props.style.width,
      newLeft: cardStyles.left,
      newWidth: cardRef.current.state.width,
      oldStartDate: props.dueDate.startDate,
      oldDueDate: props.dueDate.dueDate,
      rangeType: props.rangeType
    };
    props.resizeCard(payload);
  };

  const resizeHandler = (e, { size, handle }) => {
    if (handle === 'e') { return; }
    setCardStyles(styles => ({
      width: size.width,
      left: styles.left - (size.width - styles.width)
    }));
  };

  return (
    <ResizableBox onMouseUp={showCardHandler} onResizeStop={resizeStopHandler} onResizeStart={resizeStartHandler} onResize={resizeHandler}
    style={{ margin: `${props.style.top + 10 + 'px'} 0 10px ${cardStyles.left + 'px'}` }}
    width={cardStyles.width} className={classes.Card} height={40}
    axis="x" draggableOpts={{grid: [props.dateWidth]}} resizeHandles={['w', 'e']}
    minConstraints={[props.dateWidth]} ref={cardRef}>
      <div className={classes.Title}>{props.title}</div>
      {props.style.width > 175 && <div className={classes.Members}>
        {props.members.slice(0,3).map(member => (
          <AccountBtn key={member.email} avatar={props.avatars[member.email]}>{member.fullName[0]}</AccountBtn>
        ))}
        {props.members.length > 3 && <AccountBtn className={classes.OtherMembers}>+{props.members.length - 3}</AccountBtn>}
      </div>}
    </ResizableBox>
  );
};

RoadmapCard.propTypes = {
  style: PropTypes.shape({
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
  }),
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  avatars: PropTypes.object.isRequired,
  dateWidth: PropTypes.number.isRequired,
  resizeCard: PropTypes.func.isRequired,
  dueDate: PropTypes.object.isRequired,
  rangeType: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  avatars: state.board.avatars,
  boardID: state.board.boardID,
  rangeType: state.roadmap.dateRange.type
});

const mapDispatchToProps = dispatch => ({
  resizeCard: payload => dispatch(resizeCardHandler(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoadmapCard);
