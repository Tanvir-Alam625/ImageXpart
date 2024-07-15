// pages/protected.tsx
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';

const Protected: React.FC = () => {
    return (
        <Layout>
            <h1>Protected Page</h1>
            <p>This is a protected page. Only logged in users can see this.</p>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
};

export default Protected;
