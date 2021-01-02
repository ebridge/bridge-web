export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('OK');
}
