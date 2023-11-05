import { PropsWithChildren } from "react";

interface PopoverProps {}

const Popover = (props: PropsWithChildren<PopoverProps>) => {
  return <div>{props.children}</div>;
};

export default Popover;
