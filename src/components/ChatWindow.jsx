import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, message, List, Avatar, Spin } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { askQuestion } from '../services/knowledgeService';

const { TextArea } = Input;

const ChatContainer = styled.div`
  height: 600px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fafafa;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background-color: #1890ff;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const BotMessage = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${props => props.isUser ? '#1890ff' : '#ffffff'};
  color: ${props => props.isUser ? '#ffffff' : '#333333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const MessageReferences = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${props => props.isUser ? '#e0e0e0' : '#999999'};
`;

const ChatInputArea = styled.div`
  padding: 16px;
  border-top: 1px solid #d9d9d9;
  background-color: #ffffff;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const ChatWindow = ({ defaultQuestion }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 如果有默认问题，自动发送
  useEffect(() => {
    if (defaultQuestion) {
      handleSend(defaultQuestion);
    }
  }, [defaultQuestion]);

  const handleSend = (question) => {
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now() + Math.random(),
      text: question,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // 调用API获取回答
    askQuestion(question)
      .then(response => {
        // 添加机器人回答
        const botMessage = {
          id: Date.now() + Math.random() * 2,
          text: response.answer,
          isUser: false,
          references: response.references,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      })
      .catch(error => {
        console.error('获取回答失败:', error);
        message.error('获取回答失败，请稍后重试');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>智能骑行助手</ChatHeader>
      <ChatMessages>
        <List
          dataSource={messages}
          renderItem={item => (
            <List.Item.Meta
              avatar={<Avatar>{item.isUser ? '我' : 'AI'}</Avatar>}
              title={item.isUser ? '我' : '智能骑行助手'}
              description={
                <MessageContent isUser={item.isUser}>
                  <div>{item.text}</div>
                  {item.references && item.references.length > 0 && (
                    <MessageReferences isUser={item.isUser}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>引用文档:</div>
                      {item.references.map((ref, index) => (
                        <div key={index} style={{ marginLeft: '8px', marginTop: '4px' }}>
                          [{index + 1}] {ref.documentTitle}: {ref.content.slice(0, 100)}...
                        </div>
                      ))}
                    </MessageReferences>
                  )}
                </MessageContent>
              }
            />
          )}
        />
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInputArea>
        <InputWrapper>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入您的问题，例如：骑行前需要做哪些准备？"
            rows={3}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend(inputValue)}
            disabled={loading}
            style={{ alignSelf: 'flex-end' }}
          >
            {loading ? <Spin indicator={<LoadingOutlined spin />} /> : '发送'}
          </Button>
        </InputWrapper>
      </ChatInputArea>
    </ChatContainer>
  );
};

export default ChatWindow;