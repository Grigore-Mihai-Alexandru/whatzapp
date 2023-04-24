import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebase';
import Login from './Login';
import Loading from '@/components/Loading';
import {useEffect} from 'react';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const App = ({ Component, pageProps }: AppProps) => {
  const [user, loading] = useAuthState(auth)
  
  async function writeUserData(userID:string,email:string | null, imageUrl:string | null) {
    await setDoc(doc(db, "users", userID), {
      email: email,
      lastSeen: serverTimestamp(),
      photoURL : imageUrl
    });
  }
  useEffect(()=>{
    if(user){
      writeUserData(user.uid,user.email,user.photoURL)
    }
  },[user])

  if(loading) return <Loading/>
  if(!user) return <Login/>

  return <Component {...pageProps} />
}

export default App;