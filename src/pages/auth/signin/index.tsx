// pages/auth/signin.tsx
import { getSession, getProviders, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Box, Typography, Button } from '@mui/material';
import theme from '@/theme';
import { alpha } from '@material-ui/core';

const SignIn = ({ providers }: { providers: object }) => {
    return (
        <div 
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}
        >
            <Box sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                padding: '20px',
                borderRadius: "10px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '300px',
                minHeight: '200px',
            }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Sign In</Typography>
            {Object.values(providers).map((provider) => (
                <div key={provider.name} style={{ marginBottom: '10px' }}>
                    <Button variant="contained" onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                    </Button>
                </div>
            ))}
            </Box>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignIn;
