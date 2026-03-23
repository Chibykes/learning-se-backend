import userPaths from './users.json' with { type: 'json' };
import postPaths from './posts.json' with { type: 'json' };

export default { ...userPaths, ...postPaths };