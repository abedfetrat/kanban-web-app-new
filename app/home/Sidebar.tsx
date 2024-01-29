import ThemeToggle from "@/app/components/ThemeToggle";
import { THEMES, useTheme } from "@/app/providers/ThemeProvider";
import { auth } from "@/firebase/config";
import Image from "next/image";
import Boards from "./components/Boards";
import LogOutIcon from "./components/LogOutIcon";
import { useSidebarToggleState } from "./providers/SidebarToggleStateProvider";

export default function Sidebar() {
  const { theme } = useTheme();
  const { showSidebar, toggleSidebar } = useSidebarToggleState();

  return showSidebar ? (
    <aside className="hidden h-screen w-[262px] min-w-[262px] flex-col overflow-y-scroll border-r-2 border-light-border bg-white pb-8 dark:border-dark-border dark:bg-dark-grey md:block desktop:w-[300px] desktop:min-w-[300px] tall:flex">
      <div className="flex h-[88px] items-center pl-6 desktop:h-[96px] desktop:pl-8">
        <Image
          src={`images/logo-${theme === THEMES.light ? "dark" : "light"}.svg`}
          width={153}
          height={26}
          alt="kanban logo"
        />
      </div>
      <Boards className="flex-1 overflow-y-auto pb-8 pt-4 desktop:pt-0" />
      <div className="relative px-6 pt-4">
        <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-medium-grey/15 to-medium-grey/0 dark:from-very-dark-grey/45 dark:to-very-dark-grey/0"></div>
        <ThemeToggle />
      </div>
      <div className="mt-6 pr-6">
        <button
          onClick={() => auth.signOut()}
          className="flex w-full items-center gap-x-3 rounded-r-full py-4 pl-6 font-bold text-medium-grey transition-colors hocus:bg-primary/10 hocus:text-primary dark:hocus:bg-white dark:hocus:text-primary"
        >
          <LogOutIcon />
          Log out
        </button>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-x-3 rounded-r-full py-4 pl-6 font-bold text-medium-grey transition-colors hocus:bg-primary/10 hocus:text-primary dark:hocus:bg-white dark:hocus:text-primary"
        >
          <HideIcon />
          Hide Sidebar
        </button>
      </div>
    </aside>
  ) : (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-8 left-0 rounded-r-full bg-primary py-[19px] pl-[18px] pr-[22px] transition-colors hocus:bg-primary-hover"
    >
      <ShowIcon />
    </button>
  );
}

const HideIcon = () => (
  <svg width="18" height="16">
    <path
      d="M8.522 11.223a4.252 4.252 0 0 1-3.654-5.22l3.654 5.22ZM9 12.25A8.685 8.685 0 0 1 1.5 8a8.612 8.612 0 0 1 2.76-2.864l-.86-1.23A10.112 10.112 0 0 0 .208 7.238a1.5 1.5 0 0 0 0 1.524A10.187 10.187 0 0 0 9 13.75c.414 0 .828-.025 1.239-.074l-1-1.43A8.88 8.88 0 0 1 9 12.25Zm8.792-3.488a10.14 10.14 0 0 1-4.486 4.046l1.504 2.148a.375.375 0 0 1-.092.523l-.648.453a.375.375 0 0 1-.523-.092L3.19 1.044A.375.375 0 0 1 3.282.52L3.93.068a.375.375 0 0 1 .523.092l1.735 2.479A10.308 10.308 0 0 1 9 2.25c3.746 0 7.031 2 8.792 4.988a1.5 1.5 0 0 1 0 1.524ZM16.5 8a8.674 8.674 0 0 0-6.755-4.219A1.75 1.75 0 1 0 12.75 5v-.001a4.25 4.25 0 0 1-1.154 5.366l.834 1.192A8.641 8.641 0 0 0 16.5 8Z"
      fill="currentColor"
    />
  </svg>
);

const ShowIcon = () => (
  <svg width="16" height="11">
    <path
      d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z"
      fill="#FFF"
    />
  </svg>
);
