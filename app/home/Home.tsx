import ModalProvider from "../providers/ModalProvider";
import Sidebar from "./Sidebar";
import Navbar from "./navbar/Navbar";
import SelectedBoardProvider from "./providers/SelectedBoardProvider";
import SidebarToggleStateProvider from "./providers/SidebarToggleStateProvider";

export default function Home() {
  return (
    <SidebarToggleStateProvider>
      <SelectedBoardProvider>
        <ModalProvider>
          <div className="md:flex">
            <Sidebar />
            <div className="flex h-screen w-full flex-col overflow-hidden">
              <Navbar />
            </div>
          </div>
        </ModalProvider>
      </SelectedBoardProvider>
    </SidebarToggleStateProvider>
  );
}
