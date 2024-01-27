import ThemeToggle from "@/app/components/ThemeToggle";
import { auth } from "@/firebase/config";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { ComponentPropsWithoutRef, Fragment } from "react";
import Boards from "../components/Boards";
import LogOutIcon from "../components/LogOutIcon";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

export default function BoardSelectPopover(
  props: ComponentPropsWithoutRef<"div">,
) {
  const { selectedBoard } = useSelectedBoard();

  return (
    <Popover className="relative" {...props}>
      <Popover.Button className="flex items-center gap-x-3 text-lg font-bold leading-tight">
        <span className="truncate">
          {selectedBoard ? selectedBoard.name : "Select board"}
        </span>
        <Image
          className="ui-open:rotate-180 ui-open:transform"
          src="images/icon-chevron-down.svg"
          width={10}
          height={7}
          alt=""
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Overlay className="fixed inset-0 bg-black/25" />
      </Transition>
      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="fixed inset-0 z-10 pb-3 pt-[88px]">
          <Popover.Panel className="ml-[56px] max-h-full w-max min-w-[264px] overflow-y-scroll rounded-lg bg-white font-bold text-medium-grey dark:bg-dark-grey">
            {({ close }) => (
              <>
                <Boards onBoardSelected={(id) => close()} />
                <div className="p-4 pb-0">
                  <ThemeToggle />
                </div>
                <div className="px-4 py-6">
                  <button
                    onClick={() => auth.signOut()}
                    className="flex items-center gap-x-3"
                  >
                    <LogOutIcon />
                    Log out
                  </button>
                </div>
              </>
            )}
          </Popover.Panel>
        </div>
      </Transition>
    </Popover>
  );
}
