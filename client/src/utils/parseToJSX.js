import Parse from 'html-react-parser';

const convertSymbol = (text, symbol, start, end) => {
  let count = 0;
  while (text.includes(symbol)) {
    // increment count for each symbol, if symbol count is odd then add the start
    // html tag, else if its even then add closing tag
    count++;
    text = count % 2 ? text.replace(symbol, start) : text.replace(symbol, end);
  }
  // if theres an odd number of symbols then change last tag back to symbol
  if (count % 2) {
    let i = text.lastIndexOf(start);
    text = text.slice(0, i) + symbol + text.slice(i + start.length, text.length);
  }
  return text;
};

const convertLinks = text => {
  // no links, can return
  if (text.indexOf('_') === -1) { return text; }
  for (let i = 0; i < text.length; i++) {
    // check if _ is start of link
    if (text[i] === '_') {
      let start = i;
      let end = text.slice(start + 1, text.length).indexOf('_');
      // if no following _ or the following _ is not followed by a [ then continue
      if (end === -1 || end + start + 1 === text.length - 1 || text[end + start + 2] !== '[') { continue; }
      let linkStart = end + start + 2;
      let linkEnd = text.slice(linkStart + 1, text.length).indexOf(']');
      if (linkEnd === -1) { continue; }
      // if potential href has tag already in it then continue
      if (text.slice(linkStart, linkEnd + linkStart + 2).includes('<')) { continue; }
      // replace unformatted with formatted a tag in text
      let unformatted = text.slice(start, linkStart + linkEnd + 2);
      let formatted = `<a href="${text.slice(linkStart + 1, linkEnd + linkStart + 1)}" target="_blank" rel="noopener noreferrer">${text.slice(start + 1, end + start + 1)}</a>`;
      text = text.replace(unformatted, formatted);
      i += formatted.length;
    }
  }

  return text;
};

// takes text string as input & returns JSX
const parseToJSX = text => {
  // replace line breaks with <br />
  while (text.includes('\n')) { text = text.replace('\n', '<br />'); }
  // convert ** -> <b></b>
  text = convertSymbol(text, '*', '<b>', '</b>');
  // convert ~~ -> <i></i>
  text = convertSymbol(text, '~', '<i>', '</i>');
  // convert `` -> <code></code>
  text = convertSymbol(text, '`', '<code>', '</code>');
  // convert _link text_[link] -> <a href={link}>{link text}</a>
  text = convertLinks(text);

  // parse string of HTML to JSX
  return Parse(text);
};

export default parseToJSX;
