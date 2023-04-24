import styled from 'styled-components';
import {Avatar} from "@mui/material"
import getRecipientEmail from '@/utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

interface props{
    id:string,
    users:[string],
}

const Chat:React.FC<props> = ({id, users}) => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const recipientEmail = getRecipientEmail(users, user)
    const recipientRef = query(collection(db,"users"), where("email", "==", getRecipientEmail(users, user)))
    const [recipientSnapshot] = useCollection(recipientRef)

    const recipient = recipientSnapshot?.docs?.[0]?.data()

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }


    return (
        <Container onClick={enterChat}>
            {recipient !== undefined ? (
                <UserAvatar src={recipient.photoURL}/>
                ) :(
                <UserAvatar />
            )}
            <p>{recipientEmail}</p>
        </Container>
    );
}
 
export default Chat;

const Container = styled.div`
    display:flex;
    align-items:center;
    cursor:pointer;
    padding:15px;
    word-break:break-word;

    :hover{
        background-color:#e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`