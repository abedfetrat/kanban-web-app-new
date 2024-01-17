import Sidebar from "./Sidebar";
import SelectedBoardProvider from "./providers/SelectedBoardProvider";
import SidebarToggleStateProvider from "./providers/SidebarToggleStateProvider";

export default function Home() {
  return (
    <SidebarToggleStateProvider>
      <SelectedBoardProvider>
        <div className="md:flex">
          <Sidebar />
          <div className="flex h-screen w-full flex-col overflow-hidden"></div>
        </div>
      </SelectedBoardProvider>
    </SidebarToggleStateProvider>
  );
}
