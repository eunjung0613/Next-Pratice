import CustomServerError from '@/controllers/error/custom_server_error';
import { auth, firestore } from 'firebase-admin';
import FirebaseAdmin from '../firebase_admin';

const MEMBER_COL = 'members';
const MSG_COL = 'messages';
const SCR_NAME_COL = 'screen_names';
const Firestore = FirebaseAdmin.getInstance().Firestore;

async function post({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  }; // 익명인지 아닌지 판단
}) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자입니다.' });
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc();
    const newMessageBody: {
      message: string;
      createAt: firestore.FieldValue;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
    };
    if (author !== undefined) {
      newMessageBody.author = author;
    }
    await transaction.set(newMessageRef, newMessageBody);
  });
}

const MessageModel = {
  post,
};

export default MessageModel;