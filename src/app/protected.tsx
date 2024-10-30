import { GetServerSideProps } from 'next';
import { auth } from '../services/firebaseAdmin';

const ProtectedPage = ({ userName }: { userName: string }) => {
    return <p>Welcome, {userName}!</p>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies['__session'];

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const userName = decodedToken.name;

        return {
            props: {
                userName,
            },
        };
    } catch (error) {
        console.error('Authentication error:', error);

        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};

export default ProtectedPage;