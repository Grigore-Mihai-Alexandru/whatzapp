import ChatScreen from '@/components/ChatScreen';
import Sidebar from '@/components/Sidebar';
import { auth, db } from '@/firebase';
import getRecipientEmail from '@/utils/getRecipientEmail';
import { collection, doc, getDocs, orderBy, query , serverTimestamp, Timestamp , DocumentData, getDoc} from 'firebase/firestore';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import checkLoggedInConv from '@/utils/checkLoggedInConv';
import {useLayoutEffect} from 'react' 

type message = {
    timestamp: Timestamp;
    photoURL: string | undefined;
    id: string;
    message: string;
}

interface props {
    messagesRes:message | string,
    chat:{
        id:string,
        users:[string]
    }
}

const Chat:React.FC <props> = ({messagesRes, chat}) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const res = checkLoggedInConv(chat.users, user);

    useLayoutEffect(() => {
        if(!res){
            console.log(router.basePath)
            router.push("/")
        }
    }, [res])

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messagesRes}/>
            </ChatContainer>
        </Container>
    );
}
 
export default Chat;

export const getServerSideProps = async (context:{query:{id:string}}) => {
    const ref = doc(collection(db, 'chats'),context.query.id);

    const queryData = query(collection(ref,"messages"),orderBy("timestamp","asc"))
    const querySnapshot = await getDocs(queryData)
    let messagesRes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(message => ({
        ...message,
        timestamp: serverTimestamp()
    }))


    const chatRes = await getDoc(ref)
    const chat = {
        id:chatRes.id,
        ...chatRes.data()
    }

    //get current loggedIn user to check if user is in current chat
    // else redirect him to "/"

    // const userAuth = getAuth(app);
    // onAuthStateChanged(userAuth, (us) => {
    //     if(us)
    //     console.log(us);
    // })
    
    return {props:{
        messagesRes:JSON.stringify(messagesRes),
        chat:chat
    }}
}

const Container = styled.div`
    display:flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: hidden;
    height: 100vh;
    ::webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;