import { CustomModal } from "@components/custom-modal";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  IconButton,
  Stack,
} from "@mui/material";
import { useState } from "react";
import DeleteAccount from "./DeleteAccount/DeleteAccount";
import Profile from "./Profile/profile";
import ThemeComponent from "./Theme/theme";
import { useGetProfileQuery } from "@services/profile/profile-api";
import { IsFetching } from "@components/table-components";
import SettingsIcon from "@mui/icons-material/Settings";
import Contacts from "./contacts/contacts";

const tabsButtons = [
  { label: "Profile", Component: Profile },
  { label: "Themes", Component: ThemeComponent },
  { label: "Contacts", Component: Contacts },
  { label: "Delete Account", Component: DeleteAccount },
];

function SettingModal() {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };
  const { data, isLoading, isFetching } = useGetProfileQuery({});

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <SettingsIcon sx={{ color: "#9A9A9A", fontSize: 30 }} />
      </IconButton>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        rootSx={{ width: 800 }}
        headerLabel={"Setting"}
        closeButtonProps={{ onClick: () => setOpen(false) }}
      >
        {isLoading || isFetching ? (
          <Box>
            <IsFetching isFetching />
          </Box>
        ) : (
          <Stack flexDirection={"row"} gap={2}>
            <Card sx={{ p: 1, minWidth: { xs: 100, md: 180 } }}>
              {tabsButtons.map((button, index) => (
                <ButtonGroup
                  sx={{
                    width: "100%",
                    backgroundColor: "transparent",
                    // display: "flex",
                    my: 0.5,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    gap: 5,
                  }}
                  key={index}
                  onClick={() => {
                    handleTabClick(index);
                  }}
                  variant={selectedTab === index ? "contained" : "text"}
                  orientation="vertical"
                  aria-label="vertical contained button group"
                >
                  <Button
                    size="small"
                    endIcon={
                      selectedTab === index && <KeyboardArrowRightIcon />
                    }
                  >
                    {button.label}
                  </Button>
                </ButtonGroup>
              ))}
            </Card>
            {tabsButtons.map((button, index) => {
              if (selectedTab === index) {
                return (
                  <Box
                    sx={{
                      overflowY: "auto",
                      width: "100%",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                        backgroundColor: " #f5f5f5",
                        borderRadius: 10,
                        height: "4px",
                        cursor: "pointer",
                      },

                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                        borderRadius: "10px",
                        cursor: "pointer",
                      },
                    }}
                    height={400}
                    key={index}
                  >
                    <button.Component userData={data?.data} />
                  </Box>
                );
              }
            })}
          </Stack>
        )}
      </CustomModal>
    </>
  );
}

export default SettingModal;
