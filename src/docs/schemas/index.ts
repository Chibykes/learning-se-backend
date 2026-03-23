import userSchemas from './User.json' with { type: 'json' };
import postSchemas from './Post.json' with { type: 'json' };


export default { ...userSchemas, ...postSchemas };