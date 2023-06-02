import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { refreshToken } from "@/pages/utils/refreshToken";

export default NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })
      ],
    secret: process.env.JWT_SECRET,
    jwt: {
      encryption: true
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if(user) {
          console.log(user);
        }
        if(account) {
          console.log(account);
        }
        if(credentials) {
          console.log(credentials);
        }
        return true
      },
      async jwt({ token, user, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        if (account?.provider) {
          token.provider = account.provider;
        }
        // if (user) {
        //   const refresh_token = await refreshToken(user);
        //   // Add the refresh token to the JWT token
        //   token.refreshToken = refresh_token;
        // }
        return Promise.resolve(token);
      },
      async session({ session, token, user }) {
        if(session) {
          console.log(session);
        }
        if(token) {
          console.log(token);
        }
        if(user) {
          console.log(user);
        }

        // Retrieve the refresh token
        //const refresh_token = await refreshToken(user);

        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        //session.user.refreshToken = refresh_token;
        return Promise.resolve(session);
      },
      async authorized({ req , token }) {
        if(token) {
          console.log(token);
          return true;
        }
      },
    },
    debug: false,
});