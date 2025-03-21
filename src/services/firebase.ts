import * as admin from 'firebase-admin';
import serviceAccountKey from '../../utils/serviceAccountKey.json';

class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: admin.app.App;

  private constructor() {
    this.app = admin.apps.length 
      ? admin.apps[0]! 
      : admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount)
        });
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  public getMessaging() {
    return this.app.messaging();
  }

  public getFirestore() {
    return this.app.firestore();
  }
}

export const sendNotification = async (tokens: string[], notification: { title: string; message: string }) => {
  const firebase = FirebaseAdmin.getInstance();
  
  const message = {
    notification: {
      title: notification.title,
      body: notification.message,
    },
    tokens: tokens,
  };

  console.log(`\n\nSending notification to ${tokens[0]} \n\n`);

  return firebase.getMessaging().sendEachForMulticast(message);
};

export const db = FirebaseAdmin.getInstance().getFirestore();
export default FirebaseAdmin.getInstance();
