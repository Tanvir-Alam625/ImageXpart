import React from 'react';
import dynamic from 'next/dynamic'
const DrawingCanvas = dynamic(() => import('@/components/DrawingCanvas'), { ssr: false })
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { Container } from '@mui/material';
import { DrawingCanvas1 } from '@/components/DrawingCanvas1';

const DrawingPage: React.FC = () => {
    return (
        <Layout>
            <Container>
                {/* <h1>Drawing Page</h1> */}
                {/* <DrawingCanvas /> */}
                <DrawingCanvas1 />
            </Container>
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

export default DrawingPage;
