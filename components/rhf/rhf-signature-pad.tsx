import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  useTheme
} from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

// ----------------------------------------------------------------------

export function SignaturePad({
  name,
  defaultImage,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();
  const [showSignCanvas, setShowSignCanvas] = useState(false);
  const [initialImage, setInitialImage] = useState(defaultImage);

  const theme: any = useTheme();
  const sigCanvas: any = useRef();

  useEffect(() => {
    if (defaultImage) {
      setShowSignCanvas(true);
      setInitialImage(defaultImage);
    } else {
      setShowSignCanvas(false);
    }
  }, [defaultImage]);

  const urlToFile = (url: any): any => {
    const arr = url.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const data = arr[1];
    const dataStr = atob(data);
    let n = dataStr.length;
    const dataArr = new Uint8Array(n);
    while (n--) {
      dataArr[n] = dataStr.charCodeAt(n);
    }
    const file = new File(
      [dataArr],
      `File(${new Date().toLocaleDateString("en-US")}).png`,
      {
        type: mime,
      }
    );
    return file;
  };

  const formatIntoPng = (isClear: boolean): any => {
    if (isClear) return null;

    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      const file = urlToFile(dataURL);
      return file;
    }
    return null;
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box {...other}>
          <FormLabel>{other.label}</FormLabel>
          <Box
            sx={{
              width: "100%",
              border: `1.5px solid ${theme.palette.grey[500_32]}`,
              // border: `1.5px solid ${theme.palette.primary.main}`,
              borderRadius: "4px",
              display: !other.disabled ? "flex" : "block",
              justifyContent: !other.disabled ? "center" : null,
              padding: "0",
            }}
          >
            {showSignCanvas && initialImage && (
              <>
                <Image alt="sign" width={300} height={135} src={initialImage} />
              </>
            )}
            {!other?.disabled && !showSignCanvas && (
              <SignatureCanvas
                penColor="black"
                onEnd={() => {
                  field.onChange(formatIntoPng(false));
                }}
                canvasProps={{
                  style: {
                    width: "65%",
                    height: "100%",
                    background: "#f3f4f8",
                    margin: "25px 0",
                  },
                }}
                ref={sigCanvas}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              marginTop: "10px",
            }}
          >
            {!other.disabled && (
              <Button
                sx={{ justifyContent: "end" }}
                onClick={() => {
                  setShowSignCanvas(false);
                  setInitialImage(null);
                  sigCanvas?.current?.clear();
                  field.onChange(formatIntoPng(true));
                }}
                variant="contained"
                size="medium"
              >
                Clear
              </Button>
            )}
          </Box>
          {Boolean(error) && (
            <FormHelperText error sx={{ px: 2 }}>
              {error?.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
