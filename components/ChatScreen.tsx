import { auth, db } from "@/firebase";
import { Avatar } from "@mui/material";
import { DocumentData, Timestamp, addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import {useState, useRef} from 'react';
import getRecipientEmail from "@/utils/getRecipientEmail";
import TimeAgo from "timeago-react";

export type message = {
    timestamp: Timestamp;
    photoURL: string | undefined;
    id: string;
    message: string;
} 
interface props {
    messages: message | string,
    chat:{
        id:string,
        users:[string]
    }
}
const ChatScreen:React.FC <props> = ({messages, chat}) => {
    const [user] = useAuthState(auth)
    const [input, setInput] = useState("");
    const endOfMessageRef = useRef<null | HTMLDivElement>(null);
    const router = useRouter()
    const ref = doc(collection(db, "chats"), router.query.id?.toString());
    const [messagesSnapshot] = useCollection(query(collection(ref,"messages"), orderBy("timestamp", "asc")))
    const [recipientSnapshot] = useCollection(query(collection(db, "users"),where("email", "==", getRecipientEmail(chat.users,user))))

    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message => (
                <Message
                key={message.id}
                user={message.data().user}
                message={{
                    id: message.data().id,
                    photoURL: message.data().photoURL,
                    message: message.data().message,
                    timestamp: message.data().timestamp,
                }}
                />
            ))
        }
        // else if(typeof messages === "string"){
        //     return JSON.parse(messages).map((message:DocumentData) => (
        //         <Message 
        //         key={message.id}
        //         user={message.data().user}
        //         message={{
        //             id: message.data().id,
        //             photoURL: message.data().photoURL,
        //             message: message.data().message,
        //             timestamp: message.data().timestamp
        //         }}
        //         />
        //     ))
        // }
    }

    const sendMessage = (e:any) => {
        e.preventDefault();
        if(user){
            const userRef = doc(db, "users", user.uid)
            //update user last seen
            setDoc(userRef,{lastSeen: serverTimestamp()}, {merge: true})
            addDoc(collection(ref,"messages"),{
                timestamp:serverTimestamp(),
                message:input,
                user:user.email,
                photoURL: user.photoURL,
            })
            setInput("")
            scrollToBottom()
        }
    }

    const scrollToBottom = () => {
        if(endOfMessageRef !== null && endOfMessageRef.current !== null)
            endOfMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }

    const recipientEmail = getRecipientEmail(chat.users, user)
    const recipient = recipientSnapshot?.docs?.[0]?.data()

    return (
        <Containers>
            <Header>
                {recipient?.photoURL ? (
                    <Avatar src={recipient.photoURL}/>
                ) :(
                    <Avatar/>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? ( 
                        <p>Last active:{' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient.lastSeen.toDate()} />
                            ):"unavailable"
                            }    
                        </p>
                    ):(
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={(e) => setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={e => sendMessage(e)}>Send message</button>
                <MicIcon/>
            </InputContainer>
        </Containers>
    );
}
 
export default ChatScreen;

const Containers = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    /* max-width: 350px; */
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display:none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    position:sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding-top: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    >h3{
        margin-bottom: 3px;
    }
    >p{
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 7px 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display:flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    position: sticky;
    bottom: 0;
    background-color: whitesmoke;
    margin: 0 15px;
`;