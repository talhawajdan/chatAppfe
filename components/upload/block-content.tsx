// @mui
import { Typography, Stack } from "@mui/material";
import { UploadFileIcon } from "@assets/icons";
// assets

// ----------------------------------------------------------------------
interface BlockContentProps {
  supportedFormats?: string;
}

export function BlockContent({supportedFormats}:BlockContentProps): JSX.Element {
  return (
    <Stack alignItems="center" justifyContent="center">
      <UploadFileIcon sx={{ color: "primary.main", mb: "1rem" }} />
      <Typography gutterBottom variant="subtitle2">
        Drag & drop files or{" "}
        <Typography
          variant="subtitle2"
          component="span"
          sx={{ color: "primary.main" }}
        >
          Browse
        </Typography>
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {`Supported formats: ${supportedFormats ? supportedFormats : 'JPEG, PNG, GIF'}`}
      </Typography>
    </Stack>
  );
}
