import React, { useState, useEffect } from 'react';
import { Box, Button, TextInput, Main, Typography, Flex } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { ChatContainer, MessageList, Message, ConversationList, ConversationItem } from './Chat.styles';
import { useAdminUser } from '../../hooks/useAdminUser';

interface IMessage {
  id: string;
  chatRoomId: string;
  content: string;
  sender: number;
  receiver: number;
  senderEmail: string;
  createdAt: string;
}

interface User {
  id: number;
  email: string;
  username: string;
}

const ChatPage = () => {
  const [conversations, setConversations] = useState<{[key: string]: IMessage[]}>({});
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersExpanded, setIsUsersExpanded] = useState(false);
  const user = useAdminUser();

  // Don't fetch messages until we have user info
  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchUsers();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const { data } = await response.json();
      
      // Group messages by chatRoomId
      const groupedMessages = data.reduce((acc: any, message: IMessage) => {
        if (!acc[message.chatRoomId]) {
          acc[message.chatRoomId] = [];
        }
        acc[message.chatRoomId].push(message);
        return acc;
      }, {});

      setConversations(groupedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const { data } = await response.json();
      setUsers(data.filter((u: User) => u.id !== user?.id));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const [senderId, recipientId] = selectedChat.split('_');
    
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          senderId: user.id,
          recipientId: user.id === parseInt(senderId) ? recipientId : senderId
        }),
      });

      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewChat = async (recipientId: number) => {
    if (!user) return;
    const ids = [user.id, recipientId].sort();
    const chatRoomId = ids.join('_');
    setSelectedChat(chatRoomId);
    setIsUsersExpanded(false);
  };

  return (
    <Main>
      <Box paddingTop={6} paddingBottom={2}>
        <Typography variant="alpha">Chat</Typography>
      </Box>
      <Box padding={4}>
        <Flex>
          <Box padding={4} background="neutral0" shadow="tableShadow" width="250px">
            <Box 
              tag="button" 
              onClick={() => setIsUsersExpanded(prev => !prev)}
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none' }}
              padding={3}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Flex gap={2}>
                  <Plus />
                  <Typography>Start New Chat</Typography>
                </Flex>
                <Box tag="span" style={{ 
                  transform: isUsersExpanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}>▼</Box>
              </Flex>
            </Box>
            {isUsersExpanded && (
              <Box padding={3}>
                {users.map(u => (
                  <ConversationItem
                    key={`user-${u.id}`}
                    onClick={() => startNewChat(u.id)}
                  >
                    <Typography>{u.email}</Typography>
                  </ConversationItem>
                ))}
              </Box>
            )}

            <Box paddingTop={4}>
              <Typography variant="sigma">Recent Chats</Typography>
              <ConversationList>
                {Object.entries(conversations).map(([chatRoomId, messages]) => {
                  const lastMessage = messages[messages.length - 1];
                  
                  return (
                    <ConversationItem 
                      key={chatRoomId}
                      onClick={() => setSelectedChat(chatRoomId)}
                      selected={selectedChat === chatRoomId}
                    >
                      <Typography>{lastMessage.senderEmail}</Typography>
                      <Typography variant="pi">{lastMessage.content.substring(0, 30)}...</Typography>
                    </ConversationItem>
                  );
                })}
              </ConversationList>
            </Box>
          </Box>
          
          <Box padding={4} background="neutral0" shadow="tableShadow" flex="1">
            {selectedChat ? (
              <ChatContainer>
                <MessageList>
                  {conversations[selectedChat]?.map((msg) => (
                    <Message key={msg.id} isAdmin={msg.sender === user?.id}>
                      <Typography>{msg.content}</Typography>
                      <Typography variant="pi">{new Date(msg.createdAt).toLocaleString()}</Typography>
                    </Message>
                  ))}
                </MessageList>
                <Box padding={4} background="neutral0">
                  <TextInput
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} fullWidth marginTop={2}>
                    Send
                  </Button>
                </Box>
              </ChatContainer>
            ) : (
              <Typography>Select a conversation to start chatting</Typography>
            )}
          </Box>
        </Flex>
      </Box>
    </Main>
  );
};

export default ChatPage;
