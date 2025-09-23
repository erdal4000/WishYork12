import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import placeholderData from '../placeholder-images.json';

type SignUpData = {
  [key: string]: any;
};

export async function signUpWithEmailAndPassword(
  data: SignUpData
): Promise<{ user?: UserCredential['user']; error?: any }> {
  const { email, password, ...restData } = data;

  try {
    // Create user with email and password in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // If user created successfully, save additional data to Firestore
    if (user) {
      // Create a document reference with the user's UID
      const userRef = doc(db, 'users', user.uid);

      // Generate a unique avatar URL from the placeholder template
      const avatarUrl = placeholderData.profileAvatar.template.replace('{seed}', user.uid);

      // Save the rest of the form data to the user's document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        ...restData,
        avatarUrl,
        createdAt: serverTimestamp(),
      });
      return { user };
    }
    return { error: 'User creation failed.' };
  } catch (error) {
    // Handle errors (e.g., email already in use)
    console.error('Error signing up:', error);
    return { error };
  }
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<{ user?: UserCredential['user']; error?: any }> {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    return { error };
  }
}

export async function signInWithGoogle(): Promise<{ user?: UserCredential['user']; error?: any }> {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user document already exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    // If user is new, create a document for them in Firestore
    if (!docSnap.exists()) {
       // Generate a unique avatar URL from the placeholder template
       const avatarUrl = placeholderData.profileAvatar.template.replace('{seed}', user.uid);

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL || avatarUrl,
        accountType: 'individual',
        createdAt: serverTimestamp(),
      });
    }

    return { user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { error };
  }
}

export async function signOutUser(): Promise<{ success?: boolean; error?: any }> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

    