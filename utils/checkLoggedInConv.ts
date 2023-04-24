import { User } from "firebase/auth";

const checkLoggedInConv = (users:[string], userLoggedIn:User | null | undefined) => {
    let result:boolean = false;
    users?.forEach(userToFilter => {
        if(userToFilter === userLoggedIn?.email)
            result = true
    });
    return result
}

export default checkLoggedInConv;