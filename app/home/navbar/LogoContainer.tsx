import Image from "next/image";
import { useSidebarToggleState } from "../providers/SidebarToggleStateProvider";

export default function LogoContainer() {
  const { showSidebar } = useSidebarToggleState();
  return (
    !showSidebar && (
      <div className="hidden place-items-center border-r-2 border-light-border px-6 py-5 pb-7 dark:border-dark-border md:grid">
        <Image
          src="/images/logo-dark.svg"
          width={153}
          height={26}
          alt="kanban logo"
          className="min-w-[153px] dark:hidden"
        />
        <Image
          src="/images/logo-light.svg"
          width={153}
          height={26}
          alt="kanban logo"
          className="hidden min-w-[153px] dark:block"
        />
      </div>
    )
  );
}
