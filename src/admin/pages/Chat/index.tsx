import React, { useState } from 'react';
import { Box, Button, TextInput, Main } from '@strapi/design-system';
import { ChatContainer, MessageList, Message } from './Chat.styles';

const ChatPage = () => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'admin' }]);
      setNewMessage('');
    }
  };

  return (
    <Main>
      <Box paddingTop={6} paddingBottom={2}>
        <Box paddingLeft={6}>
          <h2>Chat</h2>
          <p>Chat with users</p>
        </Box>
      </Box>
      <Box padding={8}>
        <ChatContainer>
          <MessageList>
            {messages.map((msg, idx) => (
              <Message key={idx} isAdmin={msg.sender === 'admin'}>
                {msg.text}
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
      </Box>
    </Main>
  );
};

export default ChatPage;
