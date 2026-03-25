import authPaths from './auth.json' with { type: 'json' };
import postPaths from './posts.json' with { type: 'json' };
import userPaths from './users.json' with { type: 'json' };

export default { ...authPaths, ...userPaths, ...postPaths };
