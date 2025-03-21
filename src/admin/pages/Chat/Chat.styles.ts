import styled from 'styled-components';
import { Box } from '@strapi/design-system';

export const ChatContainer = styled(Box)`
  height: 70vh;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const Message = styled.div<{ isAdmin: boolean }>`
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 70%;
  word-break: break-word;
  background: ${({ isAdmin, theme }) =>
    isAdmin ? theme.colors.primary200 : theme.colors.neutral200};
  align-self: ${({ isAdmin }) => (isAdmin ? 'flex-end' : 'flex-start')};
`;

export const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ConversationItem = styled.div<{ selected?: boolean }>`
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  background: ${({ selected, theme }) => 
    selected ? theme.colors.primary100 : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
  }
`;
