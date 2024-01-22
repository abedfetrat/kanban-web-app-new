import { ComponentPropsWithoutRef, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";

type OptionsMenuType = ComponentPropsWithoutRef<"div">;

export default function OptionsMenu({
  children,
  className,
  ...props
}: OptionsMenuType) {
  return (
    <Menu as="div" className={`relative leading-none ${className}`} {...props}>
      <Menu.Button>
        <Image
          src="/images/icon-vertical-ellipsis.svg"
          width={5}
          height={20}
          alt="toggle menu"
          className="min-w-[5px]"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-[calc(100%+24px)] z-10 flex w-56 origin-top-right flex-col items-start gap-y-6 rounded-lg bg-white p-4 text-left text-medium-grey shadow-surface-light dark:bg-dark-grey">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
