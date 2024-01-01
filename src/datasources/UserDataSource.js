const db = require('./connection');

class UserDataSource {
  static async getUserByLogin(email, _password) {
    const institutionColumnName = await this.getInstitutionColumnName();
    return db
      .select()
      .from('users as u')
      .join('institutions as i', {
        [`u.${institutionColumnName}`]: 'i.institution_id',
      })
      .where('email', 'ilike', email)
      .first()
      .then((user) => user || null)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  // this function intermediately uses the old column name for backwards compatibility
  // please remove once all users have been migrated to the new column name
  static async getInstitutionColumnName() {
    const hasOrganisationColumn = await db.schema.hasColumn(
      'users',
      'organisation',
    );
    if (hasOrganisationColumn) {
      return 'organisation'; // fallback to old column name for backwards compatibility
    }
    return 'institution_id';
  }

  static async getUserBySub(sub) {
    // eslint-disable-line no-unused-vars
    const institutionColumnName = await this.getInstitutionColumnName();
    return db
      .select()
      .from('users as u')
      .join('institutions as i', {
        [`u.${institutionColumnName}`]: 'i.institution_id',
      })
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
