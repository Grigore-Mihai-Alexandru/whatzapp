import { Avatar, Button } from '@mui/material';
import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import { doc, collection, setDoc , query, where} from "firebase/firestore";
import Chat from './Chat';

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const userChatRef = query(collection(db, "chats"), where("users","array-contains", user?.email))
    const [chatsSnapshot] = useCollection(userChatRef)
    
    const createChat = () => {
        const input = prompt('Please enter an email address for the user you wish to chat with');

        if(!input) return null;

        async function setChat() {
            const chatRef = doc(collection(db, "chats"))
            await setDoc(chatRef, {
                users:[user?.email, input]
            });
        }
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user?.email){
            //add chat to db
            setChat();
        }
    }

    const chatAlreadyExists = (recipientEmail:string) =>
        !!chatsSnapshot?.docs.find(
            chat => chat.data().users.find((user:string) => user === recipientEmail)?.length > 0
        );
    
    return (
        <Container>
            <Header>
                {user?.photoURL ? (
                    <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                ) :(
                    <UserAvatar onClick={() => auth.signOut()}/>
                )}
                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon/>
                <SearchInput placeholder='Search in chats'/>
            </Search>
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {chatsSnapshot &&
                chatsSnapshot?.docs.map(chat => 
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                )
            }
        </Container>
    );
}
 
export default Sidebar;

const Container = styled.div``;

const Header = styled.div`
    display:flex;
    position:sticky;
    top:0;
    background-color:white;
    z-index:1;
    justify-content:space-between;
    padding:15px;
    height:80px;
    border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
    cursor:pointer;
    :hover{
        opacity:0.8;
    }
`;

const Search = styled.div`
    display:flex;
    align-items:center;
    padding:20px;
    border-radius:2px;
`;

const SearchInput = styled.input`
    outline-width:0;
    border:none;
    flex:1;
`;

const IconsContainer = styled.div`
`;

const SidebarButton = styled(Button)`
    width:100%;
    color:black;
    &&&{
        border-bottom:1px solid whitesmoke;
        border-top:1px solid whitesmoke;
    }
`;