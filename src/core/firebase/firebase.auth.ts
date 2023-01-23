import { AppMessageType } from '@/store';
import {
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { SetterOrUpdater } from 'recoil';
import { FireBaseAuthErrorCode } from './enums';
import { FirebaseAuthErrorMessage } from './errors';
import { firebaseApp } from './firebase.app';

export class FirebaseAuth {
  private googleAuth: GoogleAuthProvider;

  constructor(public readonly auth: Auth) {
    this.googleAuth = new GoogleAuthProvider();
    this.googleAuth.addScope('profile');
    this.googleAuth.addScope('email');
  }

  bindStateObserver<T extends { user: User | null }>(
    setState: SetterOrUpdater<T>,
  ) {
    this.auth.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        user: user ? JSON.parse(JSON.stringify(user)) : null,
      }));
    });
  }

  getErrorMessageByCode(
    setMessage: (messages: AppMessageType) => void,
    e: unknown,
  ) {
    const error = e as Record<'code', FireBaseAuthErrorCode>;
    setMessage(new FirebaseAuthErrorMessage(error.code));
  }

  get user(): User | null {
    return this.auth.currentUser;
  }

  async signInWithPopup(provider: 'google'): Promise<UserCredential | null> {
    switch (provider) {
      case 'google':
        return signInWithPopup(this.auth, this.googleAuth);
    }
  }

  async signUpWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    return this.auth.signOut();
  }
}

export const firebaseAuth = new FirebaseAuth(firebaseApp.auth);