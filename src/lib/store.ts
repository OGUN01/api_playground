import { collection, addDoc, query, where, getDocs, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Message, ChatHistory } from './types';

// Save chat to Firebase
export async function saveChat(messages: Message[]) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // Generate a meaningful title from the first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    const title = firstUserMessage 
      ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
      : 'New Chat';
    
    // Clean and prepare messages for Firestore
    const cleanedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt ? Timestamp.fromDate(msg.createdAt) : Timestamp.now(),
      ...(msg.attachments && {
        attachments: msg.attachments.map(att => ({
          name: att.name,
          type: att.type,
          url: att.url,
          size: att.size
        }))
      })
    }));

    const chatData = {
      userId: user.uid,
      title,
      messages: cleanedMessages,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await addDoc(collection(db, 'chats'), chatData);
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
}

export async function getChatHistory(): Promise<ChatHistory[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        messages: data.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt.toDate(),
          ...(msg.attachments && { attachments: msg.attachments })
        })),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    }) as ChatHistory[];
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
}

// Delete chat from Firebase
export async function deleteChat(chatId: string) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}

// Delete all chats for the current user
export async function deleteAllChats() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting all chats:', error);
    throw error;
  }
}