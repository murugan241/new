// DeleteEmployee.js
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const DeleteEmployee = ({ selectedEmployee, onDelete,onClose }) => {
  const handleDelete = () => {
    onDelete(selectedEmployee.staffId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', mt: 5 }}>
        <Typography sx={{ width: '280px', height: '38px', fontWeight: '400', fontSize: '32px', color: '#252C58', ml: 3 }}>
          Delete Employee
        </Typography>
        <CloseIcon onClick={onClose} style={{ color: '#2596BE' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 15, ml: 3 }}>
        <Typography sx={{ width: '486px', height: '24px', fontWeight: '400', fontSize: '20px', color: '#727272', ml: 3 }}>
        Are you sure want to delete the Employee "{selectedEmployee?.firstname}" ?
        </Typography>
        <Box sx={{ mt: 20, display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            variant="outlined"
            sx={{ width: '100px', height: '40px', borderRadius: '4px', border: '1px solid #2596BE' }}
            onClick={onClose}
          >
            <Typography sx={{ width: '60px', height: '24px', fontWeight: '400', fontSize: '16px', color: '#2596BE' }}>
              Cancel
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 30, background: '#004E69', width: '100px', height: '40px', borderRadius: '4px', '&:hover': { background: '#004E69' } }}
            onClick={handleDelete}
          >
            <Typography sx={{ width: '59px', height: '24px', fontWeight: '400', fontSize: '16px', color: '#FFFFFF' }}>
              Delete
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DeleteEmployee;
