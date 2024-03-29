import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

interface DropdownProps<T> {
  className?: string;
  label?: string;
  options: T[];
  selectedOption: T;
  onOptionChange: (option: T) => void;
  mapOptionToLabel: (option: T) => string | number;
  mapOptionToId: (option: T) => string | number;
}

export default function Dropdown<T>({
  className,
  label,
  options,
  selectedOption,
  onOptionChange,
  mapOptionToLabel,
  mapOptionToId,
  ...props
}: DropdownProps<T>) {
  return (
    <Listbox
      value={selectedOption}
      onChange={onOptionChange}
      as="div"
      className={`relative ${className}`}
      {...props}
    >
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="text-sm font-bold md:text-base">
              {label}
            </Listbox.Label>
          )}
          <Listbox.Button
            className={`mt-2 flex w-full items-center justify-between rounded-[4px] border-[2px] border-light-border bg-transparent px-4 py-2 text-start font-medium leading-relaxed outline-none placeholder:text-black/25  focus:border-black dark:border-dark-border dark:placeholder:text-white/25 dark:focus:border-white ${
              open && "border-primary dark:border-primary"
            }`}
          >
            <span className="truncate">
              {selectedOption && mapOptionToLabel(selectedOption)}
            </span>
            <Image
              className={`min-w-[12px] transition-transform ${
                open && "rotate-180"
              }`}
              src="images/icon-chevron-down.svg"
              width={10}
              height={7}
              alt=""
            />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-surface-light focus:outline-none dark:bg-very-dark-grey md:absolute">
              {options.map((option) => (
                <Listbox.Option
                  key={mapOptionToId(option)}
                  value={option}
                  className="truncate cursor-default select-none px-4 py-3 font-medium text-medium-grey ui-active:bg-primary-hover/10 ui-active:text-primary dark:ui-active:bg-dark-grey"
                >
                  {mapOptionToLabel(option)}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
}
