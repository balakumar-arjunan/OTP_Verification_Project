import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Card, CardContent } from "@mui/material";

export default function Congratulations() {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserProfile = localStorage.getItem("userProfile");
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card sx={{ width: 400, padding: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5">🎉 Congratulations! 🎉</Typography>
          {userProfile ? (
            <>
              <Typography>Email: {userProfile.email}</Typography>
              <Typography>Weight: {userProfile.weight}</Typography>
              <Typography>Height: {userProfile.height}</Typography>
              <Typography>
                Medical History: {userProfile.medicalHistory}
              </Typography>
            </>
          ) : (
            <Typography color="error">No user data found.</Typography>
          )}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/landing")}
          >
            WATCH VIDEO
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
