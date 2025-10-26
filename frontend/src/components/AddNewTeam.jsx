import { useState } from 'react';

import { addTeam } from '../services/events';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AddNewTeam = ({open, setOpen, eventId}) => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxSize, setMaxSize] = useState(NaN);
    const [requiredSkills, setRequiredSkills] = useState('')

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTeam = {name, description, max_size: maxSize, required_skills: requiredSkills};
    addTeam(eventId, newTeam);
    setName('');
    setDescription('');
		setMaxSize(NaN);
		setRequiredSkills('');
    handleClose();
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="event title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              multiline
              id="event description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
							required
              margin="dense"
              id="max size"
              name="max_size"
              label="Max Size"
              type="number"
              fullWidth
              variant="standard"
              value={maxSize}
              onChange={(e) => {
								const val = e.target.value
								if(val == '' || (Number.isInteger(Number(val)) && Number(val) > 0))
									setMaxSize(val)
								if(Number.isInteger(Number(val)) && Number(val) < 0)
									setMaxSize(-val)
							}}
            />
            <TextField
							required
              margin="dense"
              multiline
              id="required skills"
              name="required_skills"
              label="Required Skills"
              type="text"
              fullWidth
              variant="standard"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Create Team
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default AddNewTeam;