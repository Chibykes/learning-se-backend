import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/passport/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      //      {
      //   id: '112961580204218457000',
      //   displayName: 'Chukwubuikem Chiabuotu',
      //   name: { familyName: 'Chiabuotu', givenName: 'Chukwubuikem' },
      //   emails: [ { value: 'daywapz001@gmail.com', verified: true } ],
      //   photos: [
      //     {
      //       value: 'https://lh3.googleusercontent.com/a/ACg8ocIXMhsfJFGcpUq_OXO-Q53AGurw0gDxcCjk1LDyJbTnOK7gaiE=s96-c'
      //     }
      //   ],
      //   provider: 'google',
      //   _raw: '{\n' +
      //     '  "sub": "112961580204218457000",\n' +
      //     '  "name": "Chukwubuikem Chiabuotu",\n' +
      //     '  "given_name": "Chukwubuikem",\n' +
      //     '  "family_name": "Chiabuotu",\n' +
      //     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIXMhsfJFGcpUq_OXO-Q53AGurw0gDxcCjk1LDyJbTnOK7gaiE\\u003ds96-c",\n' +
      //     '  "email": "daywapz001@gmail.com",\n' +
      //     '  "email_verified": true\n' +
      //     '}',
      //   _json: {
      //     sub: '112961580204218457000',
      //     name: 'Chukwubuikem Chiabuotu',
      //     given_name: 'Chukwubuikem',
      //     family_name: 'Chiabuotu',
      //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIXMhsfJFGcpUq_OXO-Q53AGurw0gDxcCjk1LDyJbTnOK7gaiE=s96-c',
      //     email: 'daywapz001@gmail.com',
      //     email_verified: true
      //   }
      // }

      try {

        // 1. Check if user exists in your DB via Prisma
        let user = await prisma.user.findUnique({
          where: { email: profile?.emails?.[0]?.value! },
        });

        // 2. If not, create them (Social Sign-up)
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName || '',
              email: profile.emails?.[0]?.value!,
              googleId: profile.id,
            },
          });
        }

        // 3. Pass the user to the next step
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);
