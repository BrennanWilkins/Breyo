import React from 'react';
import { Link } from 'react-router-dom';

// if action msg contains **(link)cardTitle(link)** then replace with link to open the card detail modal
const parseActionMsg = (msg, cardID, listID, boardID) => {
  let start = msg.indexOf('**(link)');
  if (start === -1) { return msg; }
  let startMsg = msg.slice(start + 8);
  let endMsg = startMsg.slice(startMsg.indexOf('**') + 2);
  let cardTitle = startMsg.slice(0, startMsg.indexOf('**'));
  const link = <Link to={`/board/${boardID}/l/${listID}/c/${cardID}`}>{cardTitle}</Link>;
  const parsedMsg = <span>{msg.slice(0, start)}{link}{endMsg}</span>;
  return parsedMsg;
};

export default parseActionMsg;
