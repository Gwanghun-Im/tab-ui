// components/atoms/Button.stories.tsx
import React from "react"
import { Meta } from "@storybook/react"
import Button from "./Button"
import { ButtonProps } from "@/stories/Button"

export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta
