import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import { isValidEmail } from "../utils/helpers";

export default function Register() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);

  const [data, setData] = useState({
    email: "",
    otp: "",
    weight: "",
    height: "",
    medicalHistory: "",
  });
  const { email, weight, height, medicalHistory, otp } = data;

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const nextButton = async () => {
    setError("");

    try {
      if (step === 1) {
        if (!email) {
          setError("Email is required");
          return;
        }
        if (!isValidEmail(email)) {
          setError("Invalid email format");
          return;
        }

        console.log("📡 Sending OTP request to backend...");

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          email,
        });
        console.log("✅ OTP sent response:", response.data);
      }

      if (step === 2) {
        console.log("📡 Verifying OTP...");
        const response = await axiosInstance.post(API_PATHS.AUTH.VERIFYOTP, {
          email,
          otp,
        });
        console.log("✅ OTP verified:", response.data);
        localStorage.setItem("token", response.data.token);
      }

      if (step === 3) {
        if (!weight || !height) {
          setError("Please select weight and height");
          return;
        }
        if (photo && !["image/png", "image/jpeg"].includes(photo.type)) {
          setError("Only PNG and JPG images are allowed");
          return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("weight", weight);
        formData.append("height", height);
        formData.append("medicalHistory", medicalHistory);
        if (photo) formData.append("photo", photo);

        console.log("Sending formData:", Object.fromEntries(formData));

        await axiosInstance.post(API_PATHS.AUTH.PROFILE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        localStorage.setItem(
          "userProfile",
          JSON.stringify({ email, weight, height, medicalHistory })
        );
        navigate("/congratulations");
      }

      setStep(step + 1);
    } catch (err) {
      console.error("Profile submission error:", err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card sx={{ width: 400, padding: 3 }}>
        <CardContent>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {step === 1 && (
            <div>
              <Typography variant="h6" gutterBottom>
                Enter Your Email
              </Typography>
              <TextField
                fullWidth
                value={email}
                onChange={handleChange}
                placeholder="Email"
                name="email"
              />
              <Button
                onClick={nextButton}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Next
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <Typography variant="h6" gutterBottom>
                Enter OTP
              </Typography>
              <TextField
                fullWidth
                value={otp}
                onChange={handleChange}
                placeholder="OTP"
                name="otp"
              />
              <div className="flex justify-between mt-2">
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
                <Button onClick={nextButton} variant="contained">
                  Next
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <Typography variant="h6" gutterBottom>
                Complete Profile
              </Typography>
              <Select
                fullWidth
                value={weight}
                onChange={handleChange}
                displayEmpty
                name="weight"
              >
                <MenuItem value="" disabled>
                  Select Weight
                </MenuItem>
                <MenuItem value="50kg">50kg</MenuItem>
                <MenuItem value="60kg">60kg</MenuItem>
              </Select>
              <Select
                fullWidth
                value={height}
                onChange={handleChange}
                displayEmpty
                sx={{ mt: 2 }}
                name="height"
              >
                <MenuItem value="" disabled>
                  Select Height
                </MenuItem>
                <MenuItem value="160cm">160cm</MenuItem>
                <MenuItem value="170cm">170cm</MenuItem>
              </Select>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={medicalHistory}
                onChange={handleChange}
                placeholder="Medical History"
                sx={{ mt: 2 }}
                name="medicalHistory"
              />
              <input
                type="file"
                accept=".png, .jpg"
                onChange={(e) => setPhoto(e.target.files[0])}
                style={{ marginTop: 16 }}
              />
              <div className="flex justify-between mt-2">
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
                <Button onClick={nextButton} variant="contained">
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
