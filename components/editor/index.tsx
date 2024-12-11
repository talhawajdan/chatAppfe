// next
import dynamic from "next/dynamic";
// @mui
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { EditorToolbar, formats } from "./editor-toolbar";
import "quill/dist/quill.snow.css";
//
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        bgcolor: "background.paper",
      }}
    >
      Loading...
    </Box>
  ),
});

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }: any) => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  ...(theme.palette.mode === "dark" && {
    border: `solid 1px ${theme.palette.neutral[800]}`,
  }),
  ...(theme.palette.mode === "light" && {
    border: `solid 1px ${theme.palette.neutral[200]}`,
  }),
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 200,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.neutral[900],
    },
  },
}));

// ----------------------------------------------------------------------

export function Editor({
  id = "minimal-quill",
  error,
  value,
  defaultValue,
  onChange,
  simple = false,
  helperText,
  sx,
  ...other
}: any): JSX.Element {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div>
      <RootStyle
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />
        <ReactQuill
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </RootStyle>

      {helperText && helperText}
    </div>
  );
}
