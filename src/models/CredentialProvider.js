class CredentialProvider {
  constructor() {
    this.credentials = [
      { username: 'Aaron_Harris49@gmail.com', pass: 'Test1234!' },
      { username: 'ben@inbox.com', pass: 'Test1234!' },
      { username: 'Javon4@hotmail.com', pass: 'Test1234!' },
    ];
  }

  getCredentials() {
    return this.credentials;
  }
}

module.exports = CredentialProvider;
