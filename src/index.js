/* eslint-disable no-console */
require('dotenv').config();

const path = require('path');

const express = require('express'); // eslint-disable-line import/no-unresolved
const helmet = require('helmet');
const { Provider } = require('oidc-provider'); // require('oidc-provider');

const Account = require('./models/Account');
const SettingsDataSource = require('./datasources/SettingsDataSource');
const configuration = require('./config/config');
const routes = require('./routes/routes');

const { PORT = 5000, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

const app = express();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
directives['script-src'] = ["'unsafe-inline'"];
directives['script-src-attr'] = ["'unsafe-inline'"];
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives,
    },
  }),
);

const urlFrom = (urlObject) => String(Object.assign(new URL('http://a.com'), urlObject));

// If hostname is not equal to the ISSUER and the endpoint is /.well-known then
// we need to update the database with the correct settings.
const updateExternalAuthSettingsOnFinish = (req, res, next) => {
  res.on('finish', async () => {
    if (
      urlFrom({
        protocol: req.protocol,
        host: req.get('host'),
      }) !== ISSUER
      && req.path === '/.well-known/openid-configuration'
    ) {
      // Timeout is needed because the setting gets updated by the application
      // directly after the response is returned and we need to wait for a while
      setTimeout(() => {
        SettingsDataSource.updateSettings(
          'EXTERNAL_AUTH_LOGIN_URL',
          `${ISSUER}/auth?client_id=useroffice&scope=openid%20profile%20email&response_type=code`,
        );
        SettingsDataSource.updateSettings(
          'EXTERNAL_AUTH_LOGOUT_URL',
          `${ISSUER}/session/end?client_id=useroffice`,
        );
      }, 2000);
    }
  });
  next();
};

app.use(updateExternalAuthSettingsOnFinish);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let server;
(async () => {
  let adapter;

  const provider = new Provider(ISSUER, { adapter, ...configuration });

  routes(app, provider);

  app.use(provider.callback());

  app.use(express.json());
  server = app.listen(PORT, () => {
    console.log(
      `application is listening on port ${PORT}, check its /.well-known/openid-configuration`,
    );
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
