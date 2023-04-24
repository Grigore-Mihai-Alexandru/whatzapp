import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import {Button} from '@mui/material'
import { auth, provider } from '../firebase';
import { signInWithRedirect } from "firebase/auth";


const Login:React.FC = () => {
    const signIn = () => {
        signInWithRedirect(auth, provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="/whatsapp-logo.png" width={200} height={200} alt=''/>
                <Button onClick={signIn}>Sign in with Google</Button>
            </LoginContainer>
        </Container>
    );
}
 
export default Login;

const Container = styled.div`
    display:grid;
    place-items:center;
    height:100vh;
    background-color:whitesmoke;
`;

const LoginContainer = styled.div`
    display:flex;
    flex-direction:column;
    padding:100px;
    background-color:white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;

const Logo = styled(Image)`
    margin-bottom: 50px;
`;
