import * as React from "react";
import { Box, Card, Typography, CardContent, CardMedia } from "@mui/material";

const PassportCard = () => {
    return (
        <Card sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography variant="h5">Personal Info</Typography>
                    <Typography>Info 1</Typography>
                    <Typography>Info 2</Typography>
                </CardContent>
            </Box>
            <CardMedia
                sx={{ width: 151 }}
                image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            />
        </Card>
    );
};

export default PassportCard;
