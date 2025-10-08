import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Grid, Button, Avatar, ClickAwayListener, Link } from "@mui/material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AppsIcon from "@mui/icons-material/Apps";

const MenuModal = ({ open, toggleModal, closeModal, navigate, logout }) => {
  return (
    <ClickAwayListener onClickAway={closeModal}>
      <Box sx={{ position: "relative" }}>
        <Button
          variant="text"
          style={{
            margin: "10px",
            marginRight: "0px",
            color: "black",
            opacity: "0.5",
          }}
          disableRipple
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <AppsIcon color="black" style={{ width: "30px", height: "30px" }} />
        </Button>
        {open ? (
          <Box
            style={{
              position: "absolute",
              right: "20px",
              zIndex: "2",
              backgroundColor: "white",
              width: "175px",
              borderRadius: "16px",
              padding: "14px",
              top: "50px",
              boxShadow: "rgba(112, 144, 176, 0.2) 0px 18px 40px",
            }}
          >
            <Grid container spacing={1} direction="row">
              <Grid item xs={12}>
                <button
                  style={{
                    fontSize: "14px",
                    color: "#f56565",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Log Out
                </button>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

const TopBar = ({
  isMobile,
  handleClickOpen,
  isNarrow,
  user,
  logout,
  setLastButton,
}) => {
  const [open, setOpen] = useState(false);
  const toggleModal = () => setOpen(!open);
  const closeModal = () => setOpen(false);
  const navigate = useNavigate();

  return (
    <Grid
      container
      item
      wrap="no-wrap"
      direction="column"
      style={{
        backgroundColor: "white",
      }}
    >
      {isMobile ? (
        <Grid item>
          <Button
            variant="text"
            onClick={handleClickOpen}
            style={{ margin: "10px", marginRight: "0px" }}
          >
            <DehazeIcon style={{ width: "30px", height: "30px" }} />
          </Button>
        </Grid>
      ) : null}
      <Grid container item justifyContent="flex-end">
        <Grid item>
          <MenuModal
            open={open}
            toggleModal={toggleModal}
            closeModal={closeModal}
            navigate={navigate}
            logout={logout}
          />
        </Grid>
        {!isNarrow ? (
          <Grid item>
            <Button
              variant="text"
              style={{ margin: "10px" }}
              onClick={(event) => {
                event.preventDefault();
                setLastButton("profile");
                navigate("/profile");
              }}
            >
              <Avatar style={{ width: "30px", height: "30px" }}>
                <img src={user.profile} alt={user.name} />
              </Avatar>
            </Button>
          </Grid>
      ) : null}
        </Grid>
    </Grid>
  );
};

export default TopBar;