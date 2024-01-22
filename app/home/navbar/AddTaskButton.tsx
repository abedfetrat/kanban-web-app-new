import { ComponentPropsWithoutRef } from "react";
import Button from "@/app/components/Button";
import Image from "next/image";

export default function AddTaskButton(
  props: ComponentPropsWithoutRef<"button">,
) {
  return (
    <Button {...props} size="variable" color="primary">
      <Image
        src="/images/icon-add-task-mobile.svg"
        width={12}
        height={12}
        alt=""
        className="min-w-[12px] md:hidden"
      />
      <span className="hidden md:inline">+ Add New Task</span>
    </Button>
  );
}
