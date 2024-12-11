export const Style = {
  root: (rootsx: object | undefined) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 1.5,
    p: 2,
    ...rootsx,
  }),
};
