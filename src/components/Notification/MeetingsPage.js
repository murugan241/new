import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Collapse,
  ListItemButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Send as SendIcon,
  Search as SearchIcon,
  InsertEmoticon as EmojiIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  Link as LinkIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  ViewList as ListIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

// Custom component for the @ symbol
const AtSymbol = () => <span style={{ fontSize: '1.5rem' }}>@</span>;

const MeetingPage = () => {
  const [messages, setMessages] = useState([
    { text: "User joined #all.", time: "2:47 PM", sender: "User" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [directMessageMenuAnchorEl, setDirectMessageMenuAnchorEl] = useState(null);
  const [openChannels, setOpenChannels] = useState(true);
  const [openMessages, setOpenMessages] = useState(true);
  const [openApps, setOpenApps] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openChannelDialog, setOpenChannelDialog] = useState(false);
  const [openChannelDetailsDialog, setOpenChannelDetailsDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('Blank channel');
  const [channelName, setChannelName] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [channels, setChannels] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDirectMessageMenuClick = (event) => {
    setDirectMessageMenuAnchorEl(event.currentTarget);
  };

  const handleDirectMessageMenuClose = () => {
    setDirectMessageMenuAnchorEl(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: "You", time: new Date().toLocaleTimeString() }]);
      setNewMessage('');
    }
  };

  const handleChannelToggle = () => {
    setOpenChannels(!openChannels);
  };

  const handleMessageToggle = () => {
    setOpenMessages(!openMessages);
  };

  const handleAppToggle = () => {
    setOpenApps(!openApps);
  };

  const handleOpenChannelDialog = () => {
    setOpenChannelDialog(true);
  };

  const handleCloseChannelDialog = () => {
    setOpenChannelDialog(false);
  };

  const handleOpenChannelDetailsDialog = () => {
    setOpenChannelDetailsDialog(true);
  };

  const handleCloseChannelDetailsDialog = () => {
    setOpenChannelDetailsDialog(false);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleChannelNameChange = (event) => {
    setChannelName(event.target.value);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleCreateChannel = () => {
    if (channelName.trim() !== '') {
      const newChannel = { name: `# ${channelName}` };
      setChannels([...channels, newChannel]);
      setChannelName('');
      setVisibility('public');
      handleCloseChannelDetailsDialog();
    }
  };

  const templates = [
    'Blank channel',
    'Project starter kit',
    'Help requests process',
    'Team support',
    'Feedback intake and triage',
    'New hire onboarding',
    '1-1 Coaching',
    'Sales deal tracking'
  ];

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121115', color: 'white', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#121115',
            color: 'white',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', padding: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#673ab7', width: 32, height: 32, marginRight: 1 }}>U</Avatar>
            <Typography variant="h6">User</Typography>
          </Box>
        </Toolbar>
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List>
            <ListItemButton onClick={handleChannelToggle}>
              <ListItemText primary="Channels" />
              {openChannels ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openChannels} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {channels.map((channel, index) => (
                  <ListItem button sx={{ pl: 4 }} key={index}>
                    <ListItemText primary={channel.name} />
                  </ListItem>
                ))}
                <ListItem button sx={{ pl: 4 }} onClick={handleOpenChannelDialog}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add channels" />
                </ListItem>
              </List>
            </Collapse>

            <ListItemButton onClick={handleMessageToggle}>
              <ListItemText primary="Direct messages" />
              {openMessages ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMessages} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={handleDirectMessageMenuClick}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create" />
                </ListItem>
                <Menu
                  anchorEl={directMessageMenuAnchorEl}
                  open={Boolean(directMessageMenuAnchorEl)}
                  onClose={handleDirectMessageMenuClose}
                  PaperProps={{
                    sx: {
                      width: 200,
                    },
                  }}
                >
                  <MenuItem onClick={handleDirectMessageMenuClose}>
                    <ListItemText primary="Create Direct Message" />
                  </MenuItem>
                  <MenuItem onClick={handleDirectMessageMenuClose}>
                    <ListItemText primary="Create Section" />
                  </MenuItem>
                </Menu>
                <ListItem button sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Invite people" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
        <Box sx={{ p: 2 }}>
          <IconButton
            color="inherit"
            aria-label="add"
            onClick={handleMenuClick}
            sx={{ position: 'fixed', bottom: 16, left: 16 }}
          >
            <AddIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 250,
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <StarIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Message" secondary="Start a conversation in a DM or channel" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Channel" secondary="Start a group conversation by topic" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Huddle" secondary="Start a video or audio chat" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Canvas" secondary="Create and share content" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ListIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="List" secondary="Track and manage projects" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Workflow" secondary="Automate everyday tasks" />
            </MenuItem>
          </Menu>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" sx={{ backgroundColor: '#121115', marginBottom: 2 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6"># all</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: '#1e1b23', borderRadius: 1, width: '300px', marginRight: 2 }}
              />
              <IconButton sx={{ color: 'white' }}>
                <Avatar sx={{ width: 32, height: 32 }} src="/path-to-user-icon.png" alt="User" />
              </IconButton>
              <Button variant="contained" sx={{ backgroundColor: '#673ab7', marginLeft: 1 }}>
                Huddle
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 2 }}>
          <Card sx={{ backgroundColor: '#1e1b23', color: 'white', borderRadius: 2, padding: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#673ab7', mr: 2, width: 48, height: 48 }}><DescriptionIcon /></Avatar>
                <Box>
                  <Typography variant="h6">Everyone's all here in #all</Typography>
                  <Typography variant="body2">Share announcements and updates about company news, upcoming events, or teammates who deserve some kudos.</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Chat Interface */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 400px)', overflow: 'auto', border: '1px solid #333', borderRadius: 2, padding: 2 }}>
          {messages.map((message, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#673ab7', mr: 2, width: 32, height: 32 }}>{message.sender.charAt(0)}</Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: '#673ab7' }}>{message.sender}</Typography>
                <Typography variant="body1">{message.text}</Typography>
              </Box>
              <Typography variant="caption" sx={{ ml: 1, color: '#aaa' }}>{message.time}</Typography>
            </Box>
          ))}
        </Box>

        {/* Message Input */}
        <Box sx={{ display: 'flex', mt: 2, backgroundColor: '#1e1b23', borderRadius: 2, padding: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Message #all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="format-text" onClick={handleClick}>
                    <BoldIcon />
                  </IconButton>
                  <IconButton aria-label="add-emoji">
                    <EmojiIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage} sx={{ color: 'white' }}>
            <SendIcon />
          </IconButton>
          <Menu
            id="text-format-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}><BoldIcon sx={{ mr: 1 }} /> Bold</MenuItem>
            <MenuItem onClick={handleClose}><ItalicIcon sx={{ mr: 1 }} /> Italic</MenuItem>
            <MenuItem onClick={handleClose}><LinkIcon sx={{ mr: 1 }} /> Link</MenuItem>
            <MenuItem onClick={handleClose}><AtSymbol /> Mention</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Dialog for adding channels */}
      <Dialog open={openChannelDialog} onClose={handleCloseChannelDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Create a channel</DialogTitle>
        <DialogContent>
          <List>
            {templates.map((template, index) => (
              <ListItem
                button
                key={index}
                selected={selectedTemplate === template}
                onClick={() => {
                  handleTemplateSelect(template);
                  handleOpenChannelDetailsDialog();
                }}
                sx={{
                  borderRadius: '4px',
                  mb: 1,
                  backgroundColor: selectedTemplate === template ? '' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <ListItemText primary={template} />
              </ListItem>
            ))}
            <ListItem button sx={{ p: 2 }}>
              <ListItemText primary="Show all templates" sx={{ color: '#4DA6FF' }} />
            </ListItem>
          </List>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={handleCloseChannelDialog} sx={{ mr: 1, color: 'white' }}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#673ab7' }}>Next</Button>
        </Box>
      </Dialog>

      {/* Channel Details Dialog */}
      <Dialog open={openChannelDetailsDialog} onClose={handleCloseChannelDetailsDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Channel Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel name"
            type="text"
            fullWidth
            variant="outlined"
            value={channelName}
            onChange={handleChannelNameChange}
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>Visibility</Typography>
          <RadioGroup value={visibility} onChange={handleVisibilityChange}>
            <FormControlLabel value="public" control={<Radio />} label="Public — anyone in the workspace" />
            <FormControlLabel value="private" control={<Radio />} label="Private — only specific people" />
          </RadioGroup>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={handleCloseChannelDetailsDialog} sx={{ mr: 1, color: 'white' }}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#673ab7' }} onClick={handleCreateChannel}>Create</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MeetingPage;
