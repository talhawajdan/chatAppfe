"use client";

import { withAuthGuard } from "@hoc/with-auth-guard";

function layout(props: any) {
  return <div>{props.children}</div>;
}
export default withAuthGuard(layout);
