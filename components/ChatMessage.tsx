import React from 'react';
import { Message, UserType } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
        N
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === UserType.User;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-purple-600 text-white rounded-lg rounded-tr-none p-3 max-w-lg shadow">
          <p className="text-sm break-words">{message.text}</p>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex justify-start items-end gap-3">
        <BotAvatar />
        <div className="bg-white text-gray-800 rounded-lg rounded-tl-none p-3 max-w-lg shadow">
            <p className="text-sm break-words">{message.text}</p>
        </div>
    </div>
  );
};

export default ChatMessage;