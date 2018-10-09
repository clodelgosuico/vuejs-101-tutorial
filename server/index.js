const fs = require('fs');
const path = require('path');
const Server = require('@core/server-vue');
const account = require('@component/account-vue/server/exports');

const server = new Server();
const { app } = server;

// load mock data used for /items/:id requests into memory only once instead of every request
const items = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/items.mock.json'), 'utf-8'));

// attach all the account login/logout/user routes used by the account component
account.init(app);

app.use((req, res, next) => {
  req.locals.context.title = 'Hello world';
  next();
});

app.get('/api/items/:id?', (req, res) => {
  if (req.params.id) {
    const item = items.find(({ id }) => id === Number.parseInt(req.params.id, 10));
    if (item) {
      return res.json(item);
    }

    return res.status(404).send('Item does not exist');
  }

  const perPage = 96;
  let mockfile = '';

  if (req.query.page) {
    const page = Number.parseInt(req.query.page, 10);

    if (Number.isNaN(page)) {
      return res.status(500).send(`${req.query.page} is not a valid page number`);
    }

    if (page < 1 || page > 6) {
      return res.status(404).send('Page out of bounds');
    }

    const start = (perPage * page) - (perPage - 1);
    const end = perPage * page;
    mockfile = `items.${start}-${end}.mock.json`;
  } else {
    mockfile = 'items.mock.json'; // big file - 50,000 items
  }

  const mockfilePath = path.resolve(__dirname, 'mock', mockfile);

  // in order for the xhr download event to be able to determine download progress, it needs access to the
  // lengthComputable property in the event. This will only be set if Content-Length header is defined.
  const stat = fs.statSync(mockfilePath);

  const stream = fs.createReadStream(mockfilePath, {
    // emit smaller buffer packet sizes so progress event is fired more often. more frequent progress updates --> smoother progress bar
    highWaterMark: 512,
  });

  res.set({
    'Content-Type': 'application/json',
    'Content-Length': stat.size, // allows caller to determine overall progress of the stream
  });

  return stream.pipe(res);
});

server.start();

module.exports = server;
