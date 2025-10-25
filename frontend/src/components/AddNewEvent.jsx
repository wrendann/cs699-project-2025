import { useState } from 'react';

import { addEvent } from '../services/events';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const AddNewEvent = ({open, setOpen}) => {

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');


  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newEvent = {name: name, location: location, start_date: startDate.toDate(), end_date: endDate.toDate(), description};
    addEvent(newEvent);
    setName('');
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setDescription('');
    handleClose();
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Event</DialogTitle>
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
              required
              margin="dense"
              id="event location"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker 
                  required
                  label="Start Date" 
                  closeOnSelect
                  format="DD/MM/YY hh:mm a"
                  sx={{marginLeft: 1, marginTop: 1}}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
                <DateTimePicker
                  reqired
                  label="End Date" 
                  closeOnSelect
                  format="DD/MM/YY hh:mm a"
                  sx={{marginLeft: 1, marginTop: 1}}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
            </LocalizationProvider>
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
            <DialogContentText>
              New event will be verified by admin before being added to the events page.
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default AddNewEvent;