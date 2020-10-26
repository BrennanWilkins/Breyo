// middleware to send response as server sent event
const useServerSentEvent = (req, res, next) => {
  // set headers to allow SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  // convert data to SSE format
  const sendEventData = data => {
    const sseResponse = `data: ${JSON.stringify(data)}\n\n`;
    res.write(sseResponse);
  };

  Object.assign(res, { sendEventData });

  next();
};

module.exports = useServerSentEvent;
