import React, { useState, useEffect } from 'react';
import { Layout, Button, List, Avatar, Divider, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, FileTextOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { askQuestion } from '../../services/knowledgeService';

const { Sider, Content } = Layout;

const ChatLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

const ChatSider = styled(Sider)`
  background-color: #f0f2f5;
  border-right: 1px solid #d9d9d9;
  padding: 16px;
  overflow-y: auto;
`;

const NewChatButton = styled(Button)`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatItem = styled(List.Item.Meta)`
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  &:hover {
    background-color: #e6f7ff;
  }
  &.selected {
    background-color: #1890ff;
    color: white;
  }
`;

const ChatContent = styled(Content)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #fafafa;
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const BotMessage = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${props => props.isUser ? '#1890ff' : '#ffffff'};
  color: ${props => props.isUser ? '#ffffff' : '#333333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const MessageAvatar = styled(Avatar)`
  margin: 0 ${props => props.isUser ? '12px 0 0' : '0 12px 0 0'};
  align-self: flex-end;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: ${props => props.isUser ? '#d0e6ff' : '#999999'};
  margin-left: 8px;
`;

const MessageReferences = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.isUser ? '#40a9ff' : '#f0f0f0'};
  font-size: 14px;
`;

const ReferenceItem = styled.div`
  background-color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : '#fafafa'};
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 13px;
  color: ${props => props.isUser ? '#d0e6ff' : '#666666'};
`;

const ChatInputArea = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #d9d9d9;
  background-color: #ffffff;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const InputTextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: none;
  min-height: 80px;
  max-height: 200px;
  outline: none;
  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const SendButton = styled(Button)`
  height: 40px;
  align-self: flex-end;
`;

const EmptyChat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999999;
`;

const DeleteDialog = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
`;

const ChatPage = () => {
  // 对话历史列表
  const [conversations, setConversations] = useState([]);
  // 当前选中的对话ID
  const [currentConversationId, setCurrentConversationId] = useState(null);
  // 输入框内容
  const [inputValue, setInputValue] = useState('');
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 删除确认对话框
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  // 要删除的对话ID
  const [conversationToDelete, setConversationToDelete] = useState(null);

  // 初始化对话历史
  useEffect(() => {
    // 从localStorage加载对话历史
    const savedConversations = localStorage.getItem('rideMateConversations');
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations);
      setConversations(parsedConversations);
      if (parsedConversations.length > 0) {
        setCurrentConversationId(parsedConversations[0].id);
      }
    } else {
      // 如果没有对话历史，创建一个默认对话
      createNewConversation();
    }
  }, []);

  // 保存对话历史到localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('rideMateConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // 创建新对话
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
  };

  // 获取当前对话
  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId);
  };

  // 发送消息
  const handleSendMessage = async () => {
    const question = inputValue.trim();
    if (!question) {
      message.warning('请输入问题');
      return;
    }

    setLoading(true);

    // 获取当前对话
    const currentConversation = getCurrentConversation();
    if (!currentConversation) {
      message.error('未找到当前对话');
      setLoading(false);
      return;
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString() + '_user',
      text: question,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    // 更新对话列表
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        return {
          ...conv,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          // 如果是新对话，用问题作为标题
          title: conv.title === '新对话' ? question.substring(0, 20) + (question.length > 20 ? '...' : '') : conv.title
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputValue('');

    try {
      // 调用API获取回答
      const response = await askQuestion(question);

      // 添加机器人回答
      const botMessage = {
        id: Date.now().toString() + '_bot',
        text: response.answer,
        isUser: false,
        references: response.references,
        timestamp: new Date().toISOString()
      };

      // 更新对话列表
      const finalConversations = updatedConversations.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, botMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      });

      setConversations(finalConversations);
    } catch (error) {
      console.error('获取回答失败:', error);
      message.error('获取回答失败，请稍后重试');

      // 添加错误消息
      const errorMessage = {
        id: Date.now().toString() + '_error',
        text: '抱歉，我暂时无法回答您的问题，请稍后重试。',
        isUser: false,
        error: true,
        timestamp: new Date().toISOString()
      };

      const errorConversations = updatedConversations.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      });

      setConversations(errorConversations);
    } finally {
      setLoading(false);
    }
  };

  // 处理输入框键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 显示删除确认对话框
  const showDeleteDialog = (conversationId) => {
    setConversationToDelete(conversationId);
    setDeleteDialogVisible(true);
  };

  // 确认删除对话
  const confirmDeleteConversation = () => {
    if (!conversationToDelete) return;

    // 删除对话
    const updatedConversations = conversations.filter(conv => conv.id !== conversationToDelete);
    setConversations(updatedConversations);

    // 如果删除的是当前对话，选择第一个对话或创建新对话
    if (conversationToDelete === currentConversationId) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }

    // 关闭对话框
    setDeleteDialogVisible(false);
    setConversationToDelete(null);
  };

  // 取消删除对话
  const cancelDeleteConversation = () => {
    setDeleteDialogVisible(false);
    setConversationToDelete(null);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ChatLayout>
      <ChatSider width={280}>
        <NewChatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={createNewConversation}
        >
          新对话
        </NewChatButton>

        <Divider style={{ margin: '12px 0' }} />

        <List
          dataSource={conversations}
          renderItem={conversation => (
            <List.Item
              onClick={() => setCurrentConversationId(conversation.id)}
              actions={[
                <DeleteOutlined
                  key="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteDialog(conversation.id);
                  }}
                  style={{ fontSize: '14px' }}
                />
              ]}
            >
              <ChatItem
                className={conversation.id === currentConversationId ? 'selected' : ''}
                avatar={<FileTextOutlined />}
                title={conversation.title}
                description={formatDate(conversation.updatedAt)}
              />
            </List.Item>
          )}
        />
      </ChatSider>

      <ChatContent>
        <ChatMessages>
          {conversations.length > 0 ? (
            getCurrentConversation()?.messages.map(message => (
              message.isUser ? (
                <UserMessage key={message.id}>
                  <MessageBubble isUser={message.isUser}>
                    <MessageHeader>
                      <span style={{ fontWeight: 'bold' }}>我</span>
                      <MessageTime isUser={message.isUser}>
                        {formatDate(message.timestamp)}
                      </MessageTime>
                    </MessageHeader>
                    <div>{message.text}</div>
                  </MessageBubble>
                  <MessageAvatar isUser={message.isUser} icon={<UserOutlined />} />
                </UserMessage>
              ) : (
                <BotMessage key={message.id}>
                  <MessageAvatar isUser={message.isUser} icon={<RobotOutlined />} />
                  <MessageBubble isUser={message.isUser}>
                    <MessageHeader>
                      <span style={{ fontWeight: 'bold' }}>智能骑行助手</span>
                      <MessageTime isUser={message.isUser}>
                        {formatDate(message.timestamp)}
                      </MessageTime>
                    </MessageHeader>
                    <div>{message.text}</div>
                    {message.references && message.references.length > 0 && (
                      <MessageReferences isUser={message.isUser}>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>引用文档:</div>
                        {message.references.map((ref, index) => (
                          <ReferenceItem key={index} isUser={message.isUser}>
                            <div style={{ fontWeight: 'bold' }}>[{index + 1}] {ref.documentTitle}</div>
                            <div>{ref.content.slice(0, 100)}... (相似度: {ref.similarityScore.toFixed(2)})</div>
                          </ReferenceItem>
                        ))}
                      </MessageReferences>
                    )}
                  </MessageBubble>
                </BotMessage>
              )
            ))
          ) : (
            <EmptyChat>
              <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无对话历史</div>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>点击左侧"新对话"开始聊天</div>
            </EmptyChat>
          )}
        </ChatMessages>

        <ChatInputArea>
          <InputWrapper>
            <InputTextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入您的问题，例如：骑行前需要做哪些准备？"
            />
            <SendButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSendMessage}
              loading={loading}
            >
              发送
            </SendButton>
          </InputWrapper>
        </ChatInputArea>
      </ChatContent>

      {/* 删除确认对话框 */}
      <DeleteDialog
        title="确认删除"
        open={deleteDialogVisible}
        onOk={confirmDeleteConversation}
        onCancel={cancelDeleteConversation}
        okText="删除"
        cancelText="取消"
        okType="danger"
      >
        <p>您确定要删除这个对话吗？此操作无法撤销。</p>
      </DeleteDialog>
    </ChatLayout>
  );
};

export default ChatPage;