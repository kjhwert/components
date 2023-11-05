import type { Meta } from "@storybook/react";

import Popover from "../../components/Popover";
import { StoryObj } from "@storybook/react";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  tags: ["autodocs"],
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    content: "Hello World",
  },
};
