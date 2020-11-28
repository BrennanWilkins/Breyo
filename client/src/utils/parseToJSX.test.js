import parseToJSX from './parseToJSX';
import Parse from 'html-react-parser';
import React from 'react';

test('renders bold text correctly', () => {
  const tested = parseToJSX('*bold text*, non bold text');
  const expected = Parse('<b>bold text</b>, non bold text');
  expect(tested).toMatchObject(expected);
});

test('renders italics correctly', () => {
  const tested = parseToJSX('the following text will be ~italics~');
  const expected = Parse('the following text will be <i>italics</i>');
  expect(tested).toMatchObject(expected);
});

test('renders line breaks correctly', () => {
  const tested = parseToJSX('\n hello world \n, this is a new line.');
  const expected = Parse('<br> hello world <br>, this is a new line.');
  expect(tested).toMatchObject(expected);
});

test('renders code blocks correctly', () => {
  const tested = parseToJSX('`console.log(\'hello world\')`, should be a code block.');
  const expected = Parse('<code>console.log(\'hello world\')</code>, should be a code block.');
  expect(tested).toMatchObject(expected);
});

test('handles nested blocks correctly', () => {
  const tested = parseToJSX('*~This will be bold and italics~*. \n This will be normal.');
  const expected = Parse('<b><i>This will be bold and italics</i></b>. <br> This will be normal.');
  expect(tested).toMatchObject(expected);
});

test('handles nested blocks correctly', () => {
  const tested = parseToJSX('*~This will only be bold and italics~. This will be bold*');
  const expected = Parse('<b><i>This will only be bold and italics</i>. This will be bold</b>');
  expect(tested).toMatchObject(expected);
});

test('ignores invalid syntax', () => {
  const tested = parseToJSX('*~This will not be italics. This will be bold*');
  const expected = Parse('<b>~This will not be italics. This will be bold</b>');
  expect(tested).toMatchObject(expected);
});

test('renders links correctly', () => {
  const tested = parseToJSX('To visit this link, _*click here*_[http://www.example.com]');
  const expected = Parse('To visit this link, <a href="http://www.example.com" target="_blank" rel="noopener noreferrer"><b>click here</b></a>');
  expect(tested).toMatchObject(expected);
});

test('renders links that are missing http', () => {
  const tested = parseToJSX('To visit this link, _~click here~_[example.com]');
  const expected = Parse('To visit this link, <a href="https://example.com" target="_blank" rel="noopener noreferrer"><i>click here</i></a>');
  expect(tested).toMatchObject(expected);
});
