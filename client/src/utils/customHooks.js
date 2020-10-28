// import { useState, useEffect } from 'react';
// import EventSourcePolyfill from 'eventsource';
//
// export const useEventSource = url => {
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState(false);
//
//   useEffect(() => {
//     setErr(false);
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imludml0ZXMiOltdLCJib2FyZHMiOltdLCJ' +
//     'faWQiOiI1ZjkyMDFjYTI4MGUwMTJjMjQ2ODAwODQiLCJ1c2VybmFtZSI6IkJyZW5uYW4iLCJlbWFpbCI6ImJ3aWxraW5zNzY3QGd' +
//     'tYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFVhYW8uWGluSkN1NUFtUnMxdThJQmVZRlBaaVpaOFoyZGF3LmJtR2lWTnlOMWEv' +
//     'amFVRW9tIiwiZGlzcGxheU5hbWUiOiJCcmVubmFuIiwiX192IjowfSwiaWF0IjoxNjAzNDA1NDkwLCJleHAiOjE2MDQwMTAyOT' +
//     'B9.pcxzN911GAZCdz_gCewHTtYWlDUqkid029BoTI94E5c';
//     const baseURL = 'http://localhost:9000/api';
//     const source = new EventSourcePolyfill(baseURL + url, { headers: { 'x-auth-token': token }});
//
//     source.onmessage = event => {
//       setData(JSON.parse(event.data));
//     };
//
//     source.onerror = errMsg => {
//       setErr(true);
//       console.log(errMsg);
//     };
//   }, []);
//
//   return data;
// };

import { useEffect } from 'react';

export const useModalToggle = (show, ref, close) => {
  return useEffect(() => {
    const handleClick = e => {
      // close modal if user clicks outside of modal
      if (ref.current.contains(e.target)) { return; }
      close();
    };

    if (show) { document.addEventListener('mousedown', handleClick); }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show]);
};
