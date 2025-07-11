import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import { Search, Send, MoreVert, AttachFile, EmojiEmotions, Call, Videocam } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Navbar from '../Common_Bar/NavBar';
import Sidebar from '../Common_Bar/Sidebar';
import TopBar from '../Common_Bar/TopBar';
const ChatUI = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // State for tabs

  const [chats, setChats] = useState([
    {
      name: 'Admin',
      isPrivate: true,
      unreadMessages: 2, // Number of unread messages
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Avatar image URL
      messages: [
        { sender: 'Admin', message: 'Hi there!', time: '12:24 PM', read: false },
        { sender: 'User', message: 'Hello, how are you?', time: '12:25 PM', read: true },
        { sender: 'Admin', message: 'I’m good, thank you!', time: '12:26 PM', read: false },
      ],
    },
    {
      name: 'Employees',
      isPrivate: false,
      unreadMessages: 1,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg', // Avatar image URL
      messages: [
        { sender: 'Employees', message: 'What time is the meeting?', time: '9:00 AM', read: false },
        { sender: 'User', message: 'It’s at 10 AM.', time: '9:05 AM', read: true },
      ],
    },
    {
      name: 'Human Resource',
      isPrivate: true,
      unreadMessages: 0,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg', // Avatar image URL
      messages: [{ sender: 'HR', message: '📞 Call ended', time: '12:10 PM', read: true }],
    },
  ]);

  // Filter chats based on the search term and active tab
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === 'all' || (activeTab === 'private' && chat.isPrivate))
  );

  // Handle click on a message to mark as read
  const handleMessageClick = (chatIndex, messageIndex) => {
    const updatedChats = [...chats];
    const selectedChat = updatedChats[chatIndex];
    const message = selectedChat.messages[messageIndex];

    // If the message is unread, mark it as read and update unread count
    if (!message.read) {
      message.read = true;
      selectedChat.unreadMessages -= 1; // Decrease unread message count
      setChats(updatedChats);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const updatedChats = [...chats];
      updatedChats[selectedChat].messages.push({
        sender: 'User',
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      });
      updatedChats[selectedChat].unreadMessages += 1; // Increment unread message count
      setChats(updatedChats);
      setMessage('');
    }
  };

  return (
    <Box>
  {/* Navbar */}
  <Navbar />
  <TopBar />
  

  {/* Main Layout */}
  <Box display="flex" height="100vh">
    {/* Sidebar */}
    <Sidebar />
    <Box  
          sx={{
            padding: 2,
            backgroundColor: '#fff',
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Chat
          </Typography>
          <Typography >
            Dashboard/Chat
          </Typography>
        </Box>
    {/* Chat Layout */}
    <Box flex={1} display="flex">
      {/* Chat List */}
      
      <Box
        sx={{
          width: '30%',
          borderRight: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          mt:10,
          ml:-17
        }}
      >
        {/* Chat Header */}
        

        {/* Search and Tabs */}
        <Box sx={{ padding: 2 }}>
          <TextField
            placeholder="Search chats"
            fullWidth
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
              },
            }}
          />
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="All Chats" value="all" />
            <Tab label="Private Chats" value="private" />
          </Tabs>
        </Box>

        {/* Chat List Items */}
        <List sx={{ overflowY: 'auto', flex: 1 }}>
          {filteredChats.map((chat, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setSelectedChat(index)}
              selected={selectedChat === index}
            >
              <ListItemAvatar>
                <Avatar src={chat.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>{chat.name}</Typography>
                    {chat.unreadMessages > 0 && (
                      <Badge badgeContent={chat.unreadMessages} color="success" />
                    )}
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].message
                        : 'No messages yet'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].time
                        : ''}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#e5ddd5',
          mt:8
          
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 2,
            backgroundColor: 'white',
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar src={chats[selectedChat].avatar} />
            <Typography variant="h6" sx={{ ml: 2, color: 'black' }}>
              {chats[selectedChat].name}
            </Typography>
          </Box>
          <Box>
            <IconButton>
              <Call />
            </IconButton>
            <IconButton>
              <Videocam />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflowY: 'auto',
            bgcolor: '#F1F4F799',
          }}
        >
          {chats[selectedChat].messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'User' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
              onClick={() => handleMessageClick(selectedChat, index)}
            >
              <Box
                sx={{
                  backgroundColor: msg.sender === 'User' ? '#72808B' : '#E8ECEF',
                  padding: 1.5,
                  borderRadius: 2,
                  maxWidth: '60%',
                  boxShadow: 1,
                }}
              >
                <Typography sx={{ color: msg.sender === 'User' ? 'white' : 'black' }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                    color: msg.sender === 'User' ? 'white' : 'black',
                  }}
                >
                  {msg.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 1.5,
            backgroundColor: '#fff',
            borderTop: '1px solid #ddd',
          }}
        >
          <IconButton>
            <EmojiEmotions />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <TextField
            placeholder="Type a message"
            variant="outlined"
            size="small"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              mx: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
              },
            }}
          />
          <IconButton onClick={handleSendMessage}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>

  );
};

export default ChatUI;