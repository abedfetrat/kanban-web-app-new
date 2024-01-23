import { Column } from "@/firebase/models/Column";
import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

interface ColumnPickerProps<T extends FieldValues>
  extends UseControllerProps<T> {
  columns: Column[];
  selectedColumn: Column;
}

export default function ColumnPicker<T extends FieldValues>({
  columns,
  selectedColumn,
  ...props
}: ColumnPickerProps<T>) {
  const { field } = useController(props);

  return (
    <Listbox
      {...field}
      value={selectedColumn}
      onChange={(e) => {
        field.onChange(e);
      }}
      as="div"
      className="relative mb-6"
    >
      {({ open }) => (
        <>
          <Listbox.Label className="text-sm font-bold md:text-base">
            Status
          </Listbox.Label>
          <Listbox.Button
            className={`mt-2 flex w-full items-center justify-between rounded-[4px] border-[2px] border-light-border bg-transparent px-4 py-2 text-start font-medium leading-relaxed outline-none placeholder:text-black/25  focus:border-black dark:border-dark-border dark:placeholder:text-white/25 dark:focus:border-white ${
              open && "border-primary dark:border-primary"
            }`}
          >
            <span className="truncate">{selectedColumn?.name}</span>
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
            <Listbox.Options className="mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 focus:outline-none dark:bg-very-dark-grey md:absolute">
              {columns?.map((col) => (
                <Listbox.Option
                  key={col.id}
                  value={col}
                  className="cursor-default select-none px-4 py-3 font-medium text-medium-grey ui-active:bg-primary-hover/10 ui-active:text-primary dark:ui-active:bg-dark-grey"
                >
                  {col.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
}
