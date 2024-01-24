import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Modal from "@/app/components/Modal";
import TextArea from "@/app/components/TextArea";
import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import { Subtask } from "@/firebase/models/Subtask";
import { Task } from "@/firebase/models/Task";
import {
  FieldValue,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect } from "react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import ColumnPicker from "../components/ColumnPicker";
import { useColumns } from "../hooks/useColumns";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

type AddEditTaskModalProps = {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
};

export type Inputs = {
  name: string;
  description: string;
  subtasks: Subtask[];
  column: Column;
};

export default function AddEditTaskModal({
  mode,
  isOpen,
  onClose,
  task,
}: AddEditTaskModalProps) {
  const { selectedBoard } = useSelectedBoard();
  const { columns } = useColumns();

  const defaultFormValues = {
    name: "",
    description: "",
    subtasks: [],
    column: columns[0],
  };

  const {
    control,
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "subtasks",
    control,
  });

  const selectedColumn = useWatch({ control, name: "column" });

  useEffect(() => {
    if (mode === "edit" && task) {
      const column = columns.find((col) => col.id === task.columnId);
      reset({
        name: task.name,
        description: task.description,
        subtasks: task.subtasks,
        column: column,
      });
    } else {
      setValue("column", columns[0]);
    }
  }, [mode, reset, columns, setValue, task]);

  const handleAdd = async (data: Inputs) => {
    try {
      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const boardRef = doc(boardsRef, selectedBoard!.id);
      const columnsRef = collection(boardRef, "columns");
      const columnRef = doc(columnsRef, data.column.id);
      const tasksRef = collection(columnRef, "tasks");
      const taskRef = doc(tasksRef);

      const subtasks = data.subtasks.map((subtask) => {
        return {
          ...subtask,
          id: doc(tasksRef).id,
          name: subtask.name.trim(),
        };
      });

      await setDoc(taskRef, {
        id: taskRef.id,
        name: data.name.trim(),
        createdAt: serverTimestamp(),
        description: data.description.trim(),
        subtasks: subtasks,
        columnId: data.column.id,
      });

      await updateDoc(columnRef, {
        tasksOrder: arrayUnion(taskRef.id),
      });

      toast.success(`Created new task '${data.name.trim()}'`);
    } catch (error) {
      console.log(error);
      toast.error("Error creating new task");
    }
  };

  const handleEdit = async (data: Inputs) => {
    try {
      // TODO: edit task
    } catch (error) {
      console.log(error);
      toast.error("Error saving changes");
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (mode === "add") {
      handleAdd(data);
      reset(defaultFormValues);
    } else {
      handleEdit(data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Task" : "Edit Task"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <Input
            placeholder="e.g. Take a coffee break"
            label="Title"
            error={errors?.name && "Please enter a task title."}
            {...register("name", {
              required: true,
              pattern: /^\s*.*\S.*\s*$/,
            })}
          />
          <TextArea
            className="min-h-[112px]"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
            label="Description"
            error={errors?.description && "Please enter a task description."}
            {...register("description", {
              required: false,
              pattern: /^\s*.*\S.*\s*$/,
            })}
          />
          <div className="">
            <p className="mb-2 text-sm font-bold md:text-base">Subtasks</p>
            <div className="mb-4 flex flex-col gap-y-3">
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className="flex items-start gap-x-4">
                    <Input
                      placeholder="e.g. Make coffee"
                      wrapperClassName="w-full"
                      className="w-full"
                      error={
                        errors?.subtasks?.[index]?.name &&
                        "Please enter a subtask."
                      }
                      {...register(`subtasks.${index}.name` as const, {
                        required: true,
                        pattern: /^\s*.*\S.*\s*$/,
                      })}
                    />
                    <button
                      className="mt-4 min-w-[15px]"
                      title="Delete Subtask"
                      onClick={() => remove(index)}
                    >
                      <Image
                        src="/images/icon-cross.svg"
                        width={15}
                        height={15}
                        alt=""
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              color="secondary"
              size="large"
              className="w-full"
              onClick={() => append({ id: "", name: "", completed: false })}
            >
              + Add New Subtask
            </Button>
          </div>
          <ColumnPicker
            name="column"
            columns={columns}
            selectedColumn={selectedColumn}
            control={control}
          />
        </div>
        <Button type="submit" color="primary" size="large" className="w-full">
          {mode === "add" ? "Create Task" : "Save Changes"}
        </Button>
      </form>
    </Modal>
  );
}
