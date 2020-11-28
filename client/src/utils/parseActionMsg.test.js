import parseActionMsg from './parseActionMsg';
import React from 'react';
import { Link } from 'react-router-dom';

test('does not render a link for invalid syntax', () => {
  expect(parseActionMsg('marked the due date on *(link)Test Card** as complete'))
  .toBe('marked the due date on *(link)Test Card** as complete');
});

test('renders link with correct props', () => {
  const testComp = parseActionMsg('marked the due date on **(link)Test Card** as complete', 'fakeCardID', 'fakeListID', 'fakeBoardID');
  const expectedComp = <span>marked the due date on <Link to="/board/fakeBoardID/l/fakeListID/c/fakeCardID">Test Card</Link> as complete</span>;
  expect(testComp).toMatchObject(expectedComp);
});

test('renders link with correct props', () => {
  const testComp = parseActionMsg('renamed checklist testChecklist to newChecklistName in **(link)Test Card 2**', 'fakeCardID', 'fakeListID', 'fakeBoardID');
  const expectedComp = <span>renamed checklist testChecklist to newChecklistName in <Link to="/board/fakeBoardID/l/fakeListID/c/fakeCardID">Test Card 2</Link>{''}</span>;
  expect(testComp).toMatchObject(expectedComp);
});
