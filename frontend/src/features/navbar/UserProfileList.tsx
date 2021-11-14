import * as React from "react";
import { Menu, MenuItem, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface Props {}

const UserProfileList = (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const history = useHistory();
    const logoutClicked = React.useCallback(
        () => history.push("/logout"),
        [history]
    );

    const user = useSelector((state: RootState) => state.authReducer.user);

    return (
        <div>
            <Button color="inherit" id="profile-button" onClick={handleClick}>
                {user?.username ?? "null"}
            </Button>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => alert("Debug")}>
                    <Typography variant="button">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={logoutClicked}>
                    <Typography variant="button">Logout</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default UserProfileList;
