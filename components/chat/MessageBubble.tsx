import React from 'react';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'maitri';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  const isUser = sender === 'user';

  const baseClasses = 'px-4 py-3 rounded-2xl max-w-sm sm:max-w-md md:max-w-lg';

  const userClasses = 'bg-[var(--primary-accent-color)] text-white rounded-br-lg ml-auto';
  const maitriClasses = 'bg-[var(--widget-background-color)] text-primary-text-color rounded-bl-lg mr-auto';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`${baseClasses} ${isUser ? userClasses : maitriClasses}`}>
            <p className="text-base">{text}</p>
        </div>
    </div>
  );
};

export default MessageBubble;
