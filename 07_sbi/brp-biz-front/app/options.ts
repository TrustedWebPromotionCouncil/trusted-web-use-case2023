import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt'
import prisma from '@/app/db';
import { User } from '@/types';

export const options: NextAuthOptions = {
    debug: true,
    session: {strategy: 'jwt'},
    providers: [
      CredentialsProvider({
        name: 'Email/Password',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
            placeholder: 'hoge@example.com',
          },
          password: {label: 'Password', type: 'password'},
        },
        // メルアド認証処理
        async authorize(credentials) {
          const user = await prisma.user.findFirst({where: { email: credentials?.email }, include: { businessUnit: { include : { legalEntity: true }}}})
          if (user && credentials?.password && user?.password && bcrypt.compareSync(credentials.password, user?.password)) {
            return user
          } else {
            return null;
          }
        }
      }),
    ],
    callbacks: {
      jwt: async ({token, user, account, profile}) => {
        if (user) {
          token.user = user;
          const u = user as any
          token.legalEntityName = u.legalEntityName;
          token.color = u.color;
        }
        if (account) {
          token.accessToken = account.access_token
        }
        return token;
      },
      session: ({session, token}) => {
        token.accessToken
        return {
          ...session,
          user: {
            ...session.user,
            principle: token.user
          },
        };
      },
    }
  }
;