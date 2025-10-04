import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import LockerIcon from "../assets/lockerIcon.png";
import ShipmentsIcon from "../assets/shipmentIcon.png";
import DeliveredIcon from "../assets/deliveredIcon.png";


const WelcomeEventsBox = ({ setLastButton, user }) => {
  return (
    <Grid item size={{xs: 12, lg:7}}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft={{ xs: "15px", lg: "15px" }}
        marginRight={{ xs: "15px", lg: "15px" }}
        sx={{
          padding: "2.5%",
          paddingBottom: "3%",
          borderRadius: "20px",
          backgroundColor: "white",
          marginBottom: "15px",
          marginTop: "20px",
        }}
        
      >
        <Grid
          item
          size={12}
          style={{
            backgroundColor: "white",
            marginBottom: "5px",
            marginTop: "5px",
            marginLeft: "10px",
          }}
        >
          <Typography variant="h5" fontFamily="DM Sans" fontWeight="500">
            Welcome, {user.name}!
          </Typography>
        </Grid>
      </Box>

      <Grid
        container
        direction={"row"}
        spacing={2}
        style={{ padding: "0px 15px 0px" }}
        // backgroundColor="red"
        
      >
      </Grid>
    </Grid>
  );
};

const Dashboard = ({ isNarrow, setLastButton, user }) => {
  return (
    <Grid container direction={"row"} rowSpacing={1.5}>
      <WelcomeEventsBox
        setLastButton={setLastButton}
        user={user}
      />
    </Grid>
  );
};

export default Dashboard;
