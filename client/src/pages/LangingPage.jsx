import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, CardContent, Typography } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";

export default function LandingPage() {
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/");
          return;
        }

        const response = await axiosInstance.get(API_PATHS.AUTH.WATCHVIDEO);
        console.log(response);

        setYoutubeUrl(response.data.youtubeUrl);
      } catch (error) {
        setError("Failed to load video");
        console.error(
          "Error fetching home data:",
          error.response?.data || error
        );
      }
    };

    fetchHomeData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    localStorage.removeItem("userProfile"); // Clear user profile data
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card sx={{ width: 500, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome to Your Dashboard
          </Typography>

          {error ? (
            <Typography color="error">{error}</Typography>
          ) : youtubeUrl ? (
            <iframe
              width="100%"
              height="315"
              src={youtubeUrl.replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <Typography>Loading video...</Typography>
          )}

          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
