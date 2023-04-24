import { User } from "firebase/auth";

const getRecipientEmail = (users:[string], userLoggedIn:User | null | undefined) =>
    users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;