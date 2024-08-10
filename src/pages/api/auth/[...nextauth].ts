import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextApiRequest, NextApiResponse } from 'next';
const authOptions = (req: NextApiRequest, res: NextApiResponse) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Google client ID or client secret is missing.');
    }

    return NextAuth(req, res, {
        providers: [
            GoogleProvider({
                clientId,
                clientSecret,
            }),
        ],
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            redirect: async ({ url, baseUrl }) => {
                if (url.startsWith(baseUrl + '/api/auth/signout')) {
                    return 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
                }
                return url.startsWith(baseUrl) ? url : baseUrl;
            },
        }
    });
};

export default authOptions;