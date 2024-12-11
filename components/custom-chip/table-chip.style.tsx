export const style = {
  root: (
    props: { color: string; bgcolor: string },
    rootSx: object | undefined
  ) => ({
    fontSize: "14px",
    borderRadius: "8px",
    fontWeight: 600,
    lineHeight: "20px",
    bgcolor: props.bgcolor,
    color: props.color,
    ...rootSx,
  }),
};
