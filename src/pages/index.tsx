import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import Layout from '@/components/Layout';
import { Button, Stack, Typography } from '@mui/material';
import theme from '@/theme';
import { alpha } from '@material-ui/core';
import { useRouter } from 'next/router';
import Head from 'next/head';

// interface Props {
//   session: Session;
// }

const Home = () => {
  const router = useRouter();
  // if (!session) return null;
  // const userName = session.user?.name;
  return (
    <Layout>
     
       <Head>
        <title>ImageXpert</title>
        <meta name='description' content='Home Page' />
       </Head>
       <Stack
       sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
       }}
       >
       <Typography sx={{
          color: theme.palette.primary.contrastText,
        }} variant='h4'>Sophisticated File <span style={{ color: theme.palette.primary.main }}>Management</span></Typography>
        <Typography
        variant='h6'
        sx={{
          color: theme.palette.primary.contrastText,
        
        }}
        >Welcome to the Sophisticated File Management System, 
          
          
        </Typography>
        {/* <Typography
            style={{
              color: theme.palette.primary.main,
              fontWeight: 'bold'

            }}
          >{userName}</Typography> */}
        <Button
          variant='contained'
          onClick={()=>{
            router.push('/drawing');
          }}
          >
            Go to Drawing
          </Button>
    
       </Stack>
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth/signin',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// };

export default Home;
