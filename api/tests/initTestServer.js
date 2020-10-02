/* eslint-disable no-console */
require('../loadEnv')();

let expressApp;
let listeningApp;
before(function initServer(done) {
  // Server init should not take more than 3 minutes
  this.timeout(180000);

  // Importing server will start initialization
  console.log(`Initalizing test server on port ${process.env.TEST_API_PORT}...`);
  // eslint-disable-next-line global-require
  const serverExports = require('../src/server');
  expressApp = serverExports.app;


  try {
    expressApp.on('started', () => {
      // TODO: Seeds
      const asyncExports = serverExports.getAsyncExports();
      listeningApp = asyncExports.listeningApp;
      console.log('Server started, running tests...\n');
      done();
    });
  } catch (error) {
    console.log('Error when starting server', error);
  }
});

after((done) => {
  console.log('\nClosing server and database connection...');
  listeningApp.close(() => {
    console.log('Server close.');
    process.exit(0);
    done();
  });
});
