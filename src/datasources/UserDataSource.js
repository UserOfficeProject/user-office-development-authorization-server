const db = require('./connection');

class UserDataSource {
  static async getUserByLogin(email, password) { // eslint-disable-line no-unused-vars
    return db
      .select()
      .from('users as u')
      .join('institutions as i', { 'u.organisation': 'i.institution_id' })
      .where('email', 'ilike', email)
      .first()
      .then((user) => (user || null))
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  static async getUserBySub(sub) { // eslint-disable-line no-unused-vars
    return db
      .select()
      .from('users as u')
      .join('institutions as i', { 'u.organisation': 'i.institution_id' })
      .where('oidc_sub', sub)
      .first()
      .then((user) => user || null)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}

module.exports = UserDataSource;
