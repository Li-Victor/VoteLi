import massive from 'massive';
import secret from '../secret';

export default massive(secret.DB_URI, {
  scripts: './models/dbScripts'
});
