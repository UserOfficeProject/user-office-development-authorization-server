/* eslint-disable no-console */
require('dotenv').config();

const path = require('path');

const express = require('express'); // eslint-disable-line import/no-unresolved
const helmet = require('helmet');
const { Provider } = require('oidc-provider'); // require('oidc-provider');

const Account = require('./models/Account');
const configuration = require('./config/config');
const routes = require('./routes/routes');

const { PORT = 5000, ISSUER = `user-office-development-authorization-server` } =
  process.env;
configuration.findAccount = Account.findAccount;

const app = express();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives,
    },
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let server;
(async () => {
  let adapter;

  const provider = new Provider(ISSUER, { adapter, ...configuration });

  routes(app, provider);

  app.use(provider.callback());
  server = app.listen(PORT, () => {
    console.log(
      `application is listening on port ${PORT}, check its /.well-known/openid-configuration`
    );
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
