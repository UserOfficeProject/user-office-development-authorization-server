const db = require('./connection');

class SettingsDataSource {
  static async updateSettings(settingsId, settingsValue) {
    return db('settings')
      .update({ settings_value: settingsValue })
      .where('settings_id', settingsId)
      .returning('*')
      .then((setting) => setting)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}

module.exports = SettingsDataSource;
