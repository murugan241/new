import React, { useState } from "react";
import Tick from "../../assets/project-images/tick.png";
import JohnDoe from "../../assets/project-images/john doe.png"
import Followersimage2 from "../../assets/project-images/Followers-image2.png";
import Followersimage3 from "../../assets/project-images/Followers-image3.png";
import Followersimage4 from "../../assets/project-images/Followers-image4.png";
import Followersimage5 from "../../assets/project-images/Followers-image5.png";
import Jeffery from "../../assets/project-images/Jeffry.png";
import Filehook from "../../assets/project-images/filehook.png";
import Duedate from "../../assets/project-images/Due-date.png"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
 List, ListItem, ListItemText 

} from "@mui/material";


const TaskView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    client: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "",
    projectLead: "",
    teamMembers: "",
    jobDescription: "",
    files: null,
  });
  const [storedProjects, setStoredProjects] = useState([]);
  const[showBox,setShowBox]=useState(false);

  // Open/Close popup
  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => {
    setOpenPopup(false);
    // Reset formData
    setFormData({
      taskName: "",
      client: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "",
      projectLead: "",
      teamMembers: "",
      jobDescription: "",
      files: null,
    });
  };

  // Save project details to localStorage
  const handleSave = () => {
    if (!formData.taskName || !formData.client) {
      alert("Task Name and Client are required.");
      return;
    }

    // File validation
    if (formData.files && formData.files.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    const existingProjects =
      JSON.parse(localStorage.getItem("projectData")) || [];
    const updatedProjects = [...existingProjects, formData];
    localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    setStoredProjects(updatedProjects);

    console.log("Project saved:", formData);
    handleClosePopup();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files[0] });
  };
  
  const handleToggleBox = () => {
    setShowBox((prev) => !prev);
    console.log("showBox state:", !showBox);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">Tasks</Typography>
          <Typography>Dashboard / Tasks</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
          }
          onClick={handleOpenPopup}
          sx={{
            backgroundColor: "#FF902F",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "#FF902F",
            },
            color: "white",
          }}
        >
          Create Tasks
        </Button>
      </Box>
      <Box>
      <List>
        <ListItem>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <ListItemText primary="Patient appointment booking" />
        </ListItem>
        <ListItem>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <ListItemText primary="Appointment booking with payment gateway" />
        </ListItem>
     
        <Grid container spacing={2}>
      {/* Left Side - List */}
      <Grid item xs={12} md={6}>
        <List component="nav">
          <ListItem button onClick={()=>setShowBox(!showBox)}>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
            <ListItemText primary="HMS" />
          </ListItem>
          <ListItem>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <ListItemText primary="Patient and Doctor video conferencing" />
        </ListItem>
        <ListItem>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <ListItemText primary="Private chat module" />
        </ListItem>
        <ListItem>
          <CheckCircleIcon style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <ListItemText primary="Patient Profile add" />
        </ListItem>
        </List>
      </Grid>

      {/* Right Side - Box */}
      <Grid item xs={12} md={6}>
        {showBox && (
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
            }}
          >
<Box  display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid black"
      borderRadius="20px"
      padding="10px"
      width="fit-content">
    <img src={Tick} alt="tick-image" style={{marginRight:"8px",width:"20px",height:"20px"}}/>
    <Typography variant="body1">Mark Complete</Typography>
</Box>

<Box display="flex" justifyContent="space-between">
<Box display="flex" alignItems="center" gap={2} style={{marginTop:"20px"}}>
 <img src={JohnDoe} alt="john doe" style={{width:"40px",height:"40px",objectFit:"cover"}}/>

 <Box display="flex" flexDirection="column">
    <Typography variant="body2" color="textSecondary">
        Assigned to
    </Typography>
    <Typography variant="body1">
        Ajay
    </Typography>

 </Box>
</Box>
<Box display="flex" alignItems="center" gap={2} style={{marginTop:"20px"}}>
 <img src={Duedate} alt="due date" style={{width:"40px",height:"40px",objectFit:"cover"}}/>

 <Box display="flex" flexDirection="column">
    <Typography variant="body2" color="textSecondary">
        Due Date
    </Typography>
    <Typography variant="body1">
        Mar 26,2019
    </Typography>

 </Box>
</Box>
  </Box>    
  <hr/>   
  <TextField
              name="description"
              label="Description"
              multiline
              rows={3}
              fullWidth
           
            />  
        <hr/>
<Box>
        <Typography variant="body1" color="textSecondary">Lesley Grauer created task Jan 20, 2019</Typography>
        <Typography variant="body1" color="textSecondary">Lesley Grauer added to Hospital Administration Jan 20 , 2019</Typography>
        <Typography variant="body1" color="textSecondary">Lesley Grauer assigned to John Doe Jan 20 , 2019</Typography>  
        </Box>
        <hr/>
        <Box style={{marginTop:"20px"}}>
         <Typography variant="body2" color="textSecondary">John Doe changed the due date to Sep 28 9.09pm</Typography>
         <Typography variant="body2" color="textSecondary">John Doe assigned to you 9.10pm</Typography>
         </Box>
         <Box display="flex" gap={2} style={{marginTop:"20px"}}>
           <img src={JohnDoe} alt="" style={{width:"40px",height:"40px",objectFit:"cover"}}/>
           <Box>
            <Typography variant="body1">John Doe</Typography>
            <Typography variant="body1" color="textSecondary">8.35 am</Typography>
            <Typography variant="body1" color="textSecondary">I'm just looking around</Typography>
            <Typography variant="body1" color="textSecondary">Will you tell me something about yourself?</Typography>
            <Typography variant="body2">
              <span style={{color:"orange"}}>John Doe  </span>
              <span style={{color:"green"}}>Completed this task</span>  Today at 9.27am.</Typography>
           </Box>
         </Box>
        
<Box display="flex " gap={2} style={{marginTop:"20px"}}>
<img src={JohnDoe} alt="" style={{width:"40px",height:"40px",objectFit:"cover"}}/>
<Box display="flex" flexDirection="column">
<Typography  variant="body1">John Doe attached 3 files</Typography> 

<Typography  variant="body2" color="textSecondary">Feb 17,2019</Typography>  
</Box>
</Box>
        
<Box display="flex " gap={2} style={{marginTop:"20px"}}>
<img src={Jeffery} alt="" style={{width:"40px",height:"40px",objectFit:"cover"}}/>
<Box display="flex" flexDirection="column">
<Typography  variant="body1">Jeffery Lalor attached file</Typography> 

<Typography  variant="body2" color="textSecondary">yesterday at 9.16pm</Typography>  
</Box>
</Box>
<Box display="flex" gap={2} style={{marginTop:"30px"}}>
   <img src={Filehook} alt="" style={{width:"20px",height:"20px",marginTop:"20px"}}/>
   <TextField  label="Type message..." fullWidth />
</Box>
<Box display="flex" style={{ marginTop: "30px" }}>
  <Typography variant="body1" style={{ marginTop:"10px" ,marginRight:"30px"}}>Followers</Typography>
  <img 
    src={JohnDoe} 
    alt="" 
    style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 5 }} 
  />
  <img 
    src={Followersimage2} 
    alt="" 
    style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 4 }} 
  />
  <img 
    src={Followersimage3} 
    alt="" 
    style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 3 }} 
  />
  <img 
    src={Followersimage4} 
    alt="" 
    style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 2 }} 
  />
  <img 
    src={Followersimage5} 
    alt="" 
    style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 1 }} 
  />
</Box>

</Box>   
         
        )}
      </Grid>
    </Grid>
     
      </List>
    </Box>
      {/* Create Task Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="taskName"
              label="Task Name"
              fullWidth
              value={formData.taskName}
              onChange={handleInputChange}
            />
            <TextField
              name="client"
              label="Client"
              fullWidth
              value={formData.client}
              onChange={handleInputChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={formData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="endDate"
                  label="End Date"
                  type="date"
                  fullWidth
                  value={formData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rate"
                  label="Rate"
                  fullWidth
                  value={formData.rate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="priority"
                  label="Priority"
                  fullWidth
                  value={formData.priority}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <TextField
              name="projectLead"
              label="Project Lead"
              fullWidth
              value={formData.projectLead}
              onChange={handleInputChange}
            />
            <TextField
              name="teamMembers"
              label="Team Members"
              fullWidth
              value={formData.teamMembers}
              onChange={handleInputChange}
            />
            <TextField
              name="jobDescription"
              label="Job Description"
              multiline
              rows={4}
              fullWidth
              value={formData.jobDescription}
              onChange={handleInputChange}
            />
            <Button variant="outlined" component="label">
              Upload Files
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskView;








