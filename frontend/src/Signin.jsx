import { useState } from "react";
import { signInWithEmail } from "./services/users";
import { requestReset } from "./services/resetPassword";
import {
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
} from "@mui/material";
import { Box } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const onEmailSignin = async (credentials, setUser, setErrorMessage) => {
  try {
    const response = await signInWithEmail({ credentials: credentials });
    setUser(response.user);
    window.localStorage.setItem("IITBTeamFinderUser", JSON.stringify(response.user));
    window.localStorage.setItem(
      "IITBTeamFinderUserToken",
      JSON.stringify(response.token)
    );
    document.body.style.overflow = "hidden";
  } catch (err) {
    if (err.response?.data?.error) {
      if (err.response.data.error === "wrong password") {
        setErrorMessage("Password is Incorrect. Please try again");
      }
      if (err.response.data.error === "password not allocated") {
        setErrorMessage("Password Not Allocated.");
      }
      if (
        err.response.data.error ===
        "User validation failed: name: Path `name` is required."
      ) {
        setErrorMessage("User Not Found. Please Create New Account.");
      }
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } else {
        console.log("Undefined Error. Please try again Later.")
        setErrorMessage("Undefined Error. Please try again Later.")
    };
  }
};

const EmailLogIn = ({
  setSignUp,
  email,
  setEmail,
  password,
  setPassword,
  setUser,
  forgot,
  setForgot,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotDisabled, setForgotDisabled] = useState(false);
  if (forgot === "forgot" || forgot === "requested") {

    const onVerify = async () => {
      try {
        const response = await requestReset(email);
        setForgotDisabled(false);
        if (response.status === "ok") {
          setForgot("requested");
        }
      } catch (err) {
        setForgotDisabled(false);
        if (err.response?.data?.error === "user not found")
          setErrorMessage("Email address not found. Please create new account");
        else setErrorMessage("Undefined error. Please try again later");

        setTimeout(() => setErrorMessage(""), 5000);
      }
    };

    return (
      <Box style={{ borderRadius: "16px", padding: "10px", margin: "10px" }}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <div
              style={{ fontSize: "14px", position: "relative", right: "125px" }}
            >
              <span>Email</span>
              <span style={{ color: "blue" }}>*</span>
            </div>
          </Grid>
          <Grid item>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@gmail.com"
              sx={{
                "& legend": { width: "unset" },
                "& fieldset": { top: 0, borderRadius: "16px" },
                width: "300px",
              }}
            />
          </Grid>
          {forgot === "requested" ? <div>Password reset requested</div> : null}
          {errorMessage ? <Grid item>{errorMessage}</Grid> : null}
          <Grid item>
            <Button
              variant="contained"
              style={{
                textTransform: "none",
                borderRadius: "16px",
                height: "50px",
                minWidth: "300px",
                backgroundColor: "#3311db",
                fontFamily: "DM Sans",
                marginTop: "8px",
              }}
              onClick={async (e) => {
                e.preventDefault();
                if (forgotDisabled) return;
                setForgot("forgot");
                if (!email) {
                  setErrorMessage("Please enter Email Address");
                  setTimeout(() => setErrorMessage(""), 3000);
                  return;
                }
                onVerify();
                setForgotDisabled(true);
              }}
            >
              Send Verification Email
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              size="small"
              style={{ textTransform: "none", color: "blue" }}
              onClick={(e) => {
                e.preventDefault();
                setSignUp(true);
                setForgot("login");
              }}
            >
              <span style={{ fontSize: "14px" }}>Create New Account</span>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              size="small"
              style={{ textTransform: "none", color: "blue" }}
              onClick={(e) => {
                e.preventDefault();
                setForgot("login");
              }}
            >
              <span style={{ fontSize: "14px" }}>Log in</span>
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <Box style={{ borderRadius: "16px", padding: "10px", margin: "10px" }}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <div
            style={{ fontSize: "14px", position: "relative", right: "125px" }}
          >
            <span>Email</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            sx={{
              "& legend": { width: "unset" },
              "& fieldset": { top: 0, borderRadius: "16px" },
              width: "300px",
            }}
          />
        </Grid>
        <Grid item style={{ marginTop: "5px" }}>
          <div
            style={{ fontSize: "14px", position: "relative", right: "110px" }}
          >
            <span>Password</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            sx={{
              "& fieldset": { top: 0, borderRadius: "16px" },
              "& legend": { width: "unset" },
              width: "300px",
            }}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  variant="text"
                  disableRipple
                  style={{
                    color: "rgba(0,0,0,0.4)",
                    position: "relative",
                    left: "20px",
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Button>
              ),
            }}
          />
        </Grid>
        <Grid item style={{ fontSize: "14px" }}>
          {errorMessage}
        </Grid>
        <Grid item container justifyContent="flex-end">
          <Button
            variant="text"
            style={{
              textTransform: "none",
              color: "blue",
              fontSize: "14px",
              fontFamily: "DM Sans",
            }}
            disableRipple
            onClick={(e) => {
              e.preventDefault();
              setForgot("forgot");
            }}
          >
            Forgot Password?
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
              borderRadius: "16px",
              height: "50px",
              minWidth: "300px",
              backgroundColor: "#3311db",
              fontFamily: "DM Sans",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (!email) {
                setErrorMessage("Please enter Email address.");
              } else if (!password) {
                setErrorMessage("Please enter password.");
              } else if (password.length < 8) {
                setErrorMessage("Password has less than 8 characters.");
              } else {
                const credentials = { email, password };
                onEmailSignin(credentials, setUser, setErrorMessage);
              }
              setTimeout(() => {
                setErrorMessage("");
              }, 5000);
            }}
          >
            Sign In
          </Button>
        </Grid>
        <Grid item style={{ fontSize: "14px", justifyContent: "flex-start" }}>
          Not registered yet?
          <Button
            variant="text"
            disableRipple
            style={{
              textTransform: "none",
              fontFamily: "DM Sans",
              color: "blue",
            }}
            onClick={(e) => {
              e.preventDefault();
              setSignUp(true);
            }}
          >
            <span style={{ position: "relative", bottom: "1px" }}>
              Create an Account
            </span>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const EmailSignUp = ({
  setSignUp,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  setUser,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onVerify = () => {
    const credentials = {
      name,
      email,
      password
    };
    onEmailSignin(credentials, setUser, setErrorMessage);
  };

  return (
    <Box style={{ borderRadius: "16px", padding: "10px", margin: "10px" }}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <div
            style={{ fontSize: "14px", position: "relative", right: "125px" }}
          >
            <span>Name</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Appleseed"
            sx={{
              "& legend": { width: "unset" },
              "& fieldset": { top: 0, borderRadius: "16px" },
              width: "300px",
            }}
          />
        </Grid>
        <Grid item>
          <div
            style={{ fontSize: "14px", position: "relative", right: "125px" }}
          >
            <span>Email</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            sx={{
              "& legend": { width: "unset" },
              "& fieldset": { top: 0, borderRadius: "16px" },
              width: "300px",
            }}
          />
        </Grid>
        <Grid item>
          <div
            style={{ fontSize: "14px", position: "relative", right: "110px" }}
          >
            <span>Password</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={!showPassword ? "password" : "text"}
            placeholder="Minimum 8 characters"
            sx={{
              "& legend": { width: "unset" },
              "& fieldset": { top: 0, borderRadius: "16px" },
              width: "300px",
            }}
          />
        </Grid>
        <Grid item>
          <div
            style={{ fontSize: "14px", position: "relative", right: "85px" }}
          >
            <span>Confirm Password</span>
            <span style={{ color: "blue" }}>*</span>
          </div>
        </Grid>
        <Grid item>
          <TextField
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={!showPassword ? "password" : "text"}
            placeholder="Same as password"
            sx={{
              "& legend": { width: "unset" },
              "& fieldset": { top: 0, borderRadius: "16px" },
              width: "300px",
            }}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            }
            label={<span style={{ fontSize: "14px" }}>Show Password</span>}
          />
        </Grid>
        {errorMessage ? <Grid item>{errorMessage}</Grid> : null}
        <Grid item>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
              borderRadius: "16px",
              height: "50px",
              minWidth: "300px",
              backgroundColor: "#3311db",
              fontFamily: "DM Sans",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (!name) {
                setErrorMessage("Please enter your name.");
              } else if (!email) {
                setErrorMessage("Please enter your email address.");
              } else if (!password) {
                setErrorMessage("Please enter your password.");
              } else if (password.length < 8) {
                setErrorMessage("Password has less than 8 characters.");
              } else if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
              }
              onVerify();
              setTimeout(() => {
                setErrorMessage("");
              }, 5000);
            }}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item>
          <span style={{ fontSize: "14px" }}>Already have an account?</span>
          <Button
            variant="text"
            size="small"
            style={{ textTransform: "none" }}
            onClick={(e) => {
              e.preventDefault();
              setSignUp(false);
            }}
          >
            <span style={{ fontSize: "14px", color: "blue" }}>
              Log in instead!
            </span>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Signin = ({ setUser }) => {
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [forgot, setForgot] = useState("login");

  return (
    <div style={{ scrollBehavior: "smooth" }}>
      <Grid
        container
        item
        style={{ marginBottom: "10px" }}
        direction="row"
        mt={2}
        pl={2}
      >
        <Grid item xs={8}>
          <Typography>
            <Link
              href="/"
              variant="h4"
              style={{
                position: "relative",
                left: "2px",
                top: "13px",
                cursor: "pointer",
                fontFamily: "Barlow Condensed",
                fontStyle: 'italic'
              }}
              underline="none"
              color="inherit"
            >
              IITB TEAMFINDER 
            </Link>
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ overflowY: "scroll" }}
        // backgroundColor="red"
      >
        <Grid
          item
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            position: "relative",
            right:
              forgot === "login" && !signUp
                ? "95px"
                : forgot !== "login" && !signUp
                ? "0px"
                : "0px",
            marginTop: !signUp ? "50px" : "50px",

            // backgroundColor: "green"
          }}
          mb={1}
        >
          {forgot === "login" && !signUp ? (
            <>Sign In</>
          ) : forgot !== "login" && !signUp ? (
            <>Forgot Password?</>
          ) : (
            <>Create An Account</>
          )}
        </Grid>
        {forgot === "login" && !signUp ? (
          <Grid item style={{ fontSize: "16px", color: "#a0aec0" }} mb={1}>
            Enter your email and password to sign in!
          </Grid>
        ) : null}
        <Grid item container justifyContent="center">
          {signUp ? (
            <EmailSignUp
              setSignUp={setSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              name={name}
              setName={setName}
              setUser={setUser}
            />
          ) : (
            <EmailLogIn
              setSignUp={setSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setUser={setUser}
              forgot={forgot}
              setForgot={setForgot}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Signin;
