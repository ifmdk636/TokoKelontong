import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { green } from "@mui/material/colors";

function Profile() {
  return (
    <div className="flex w-[40px] h-[40px] items-center justify-center">
      <AccountCircleIcon sx={{ color: green[800], cursor: "pointer" }} />
    </div>
  );
}

export const profileUtils = {
  avatarIcon: Profile,
};

export default Profile;
