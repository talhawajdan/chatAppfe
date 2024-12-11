import isString from "lodash/isString";
import { useDropzone } from "react-dropzone";
// @mui
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { BlockContent } from "./block-content";
import { Image } from "../image";
import { RejectionFiles } from "./rejection-files";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }: any) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.primary.main}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

export function UploadSingleFile({
  error = false,
  file,
  sx,
  onChange = (data: any) => data,
  type,
  supportedFormats,
  ...other
}: any): JSX.Element {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    onDropAccepted,
    ...other,
  });
  const isImage =
    file?.type?.includes("image") || (type === "image" && isString(file));
  const isVideo =
    file?.type?.includes("video") || (type === "video" && isString(file));

  function onDropAccepted(files: any): any {
    onChange(files[0]);
  }

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "10% 0",
          }),
        }}
      >
        <input {...getInputProps()} />
        <BlockContent supportedFormats={supportedFormats} />
        {isImage && (
          <Image
            alt="file preview"
            src={isString(file) ? file : URL.createObjectURL(file)}
            sx={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: ".4rem",
              position: "absolute",
              backgroundColor: "background.paper",
            }}
          />
        )}

        {isVideo && (
          <Box
            sx={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: ".4rem",
              position: "absolute",
              backgroundColor: "background.paper",
            }}
          >
            <video width="100%" height="100%" controls>
              <source src={URL.createObjectURL(file)} />
            </video>
          </Box>
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}
    </Box>
  );
}
