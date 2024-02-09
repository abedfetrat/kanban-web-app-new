import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Modal from "@/app/components/Modal";
import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import compareColumns from "@/firebase/utils/compareColumns";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useColumns } from "../hooks/useColumns";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

type AddEditBoardModalType = {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
};

type Inputs = {
  boardName: string;
  boardColumns: {
    columnName: string;
    columnId: string;
  }[];
};

export default function AddEditBoardModal({
  mode,
  isOpen,
  onClose,
}: AddEditBoardModalType) {
  const { selectedBoard, selectBoard } = useSelectedBoard();
  const { columns } = useColumns();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      boardName: "",
      boardColumns: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "boardColumns",
    control,
  });

  useEffect(() => {
    if (mode === "edit" && selectedBoard) {
      if (columns) {
        reset({
          boardName: selectedBoard.name,
          boardColumns: columns.map((col) => ({
            columnId: col.id,
            columnName: col.name,
          })),
        });
      } else {
        reset({ boardName: selectedBoard.name, boardColumns: [] });
      }
    } else {
      reset({ boardName: "", boardColumns: [] });
    }
  }, [mode, selectedBoard, columns, reset]);

  const handleAdd = async (data: Inputs) => {
    try {
      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const newBoardRef = doc(boardsRef);

      await setDoc(newBoardRef, {
        id: newBoardRef.id,
        name: data.boardName.trim(),
        createdAt: serverTimestamp(),
        columnsOrder: data.boardColumns.map((col) => col.columnId),
      });

      const columnsRef = collection(newBoardRef, "columns");
      const batch = writeBatch(db);
      const columnIds: string[] = [];

      data.boardColumns.forEach((col) => {
        const columnRef = doc(columnsRef);
        batch.set(columnRef, {
          id: columnRef.id,
          name: col.columnName.trim(),
          createdAt: serverTimestamp(),
          tasksOrder: [],
          boardId: newBoardRef.id,
        });
        columnIds.push(columnRef.id);
      });

      await batch.commit();

      await updateDoc(newBoardRef, { columnsOrder: columnIds });

      selectBoard(newBoardRef.id);
      toast.success(`Created new board '${data.boardName.trim()}'`);
    } catch (error) {
      console.log(error);
      toast.error("Error creating new board.");
    }
  };

  const handleEdit = async (data: Inputs) => {
    try {
      if (!selectedBoard) {
        throw new Error("No board selected");
      }
      const oldColumns = columns;
      const newColumns: Column[] = data.boardColumns.map((col) => ({
        id: col.columnId,
        name: col.columnName.trim(),
        tasksOrder: [],
        boardId: "",
      }));

      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const boardRef = doc(boardsRef, selectedBoard.id);
      const columnsRef = collection(boardRef, "columns");

      let columnsOrder: string[] = selectedBoard.columnsOrder;
      const batch = writeBatch(db);
      const { added, updated, deleted } = compareColumns(
        oldColumns,
        newColumns,
      );

      // Add all new columns to db
      added.forEach((col) => {
        const columnRef = doc(columnsRef);
        batch.set(columnRef, {
          id: columnRef.id,
          name: col.name,
          createdAt: serverTimestamp(),
        });
        columnsOrder.push(columnRef.id);
      });

      // Update db with updated columns
      updated.forEach((col) => {
        const columnRef = doc(columnsRef, col.id);
        batch.update(columnRef, { name: col.name });
      });

      // Delete columns from db
      deleted.forEach((col) => {
        const columnRef = doc(columnsRef, col.id);
        batch.delete(columnRef);
        columnsOrder = columnsOrder.filter((id) => id !== columnRef.id);
      });

      // Update board with new name and column order
      await updateDoc(boardRef, {
        name: data.boardName.trim(),
        columnsOrder: columnsOrder,
      });

      await batch.commit();
      toast.success("Successfully edited board");
    } catch (error) {
      console.log(error);
      toast.error("Error editing board.");
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (mode === "add") {
      handleAdd(data);
      reset();
    } else {
      handleEdit(data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Board" : "Edit Board"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="e.g. Web Design"
          label="Board Name"
          error={errors?.boardName && "Please enter a board name."}
          {...register("boardName", {
            required: true,
            pattern: /^\s*.*\S.*\s*$/,
          })}
        />
        <div className="mb-6 mt-4">
          <p className="mb-2 text-sm font-bold md:text-base">Board Columns</p>
          <div className="mb-4 flex flex-col gap-y-3">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex items-start gap-x-4">
                  <Input
                    placeholder="e.g. Todo"
                    wrapperClassName="w-full"
                    className="w-full"
                    error={
                      errors?.boardColumns?.[index]?.columnName &&
                      "Please enter a column name."
                    }
                    {...register(`boardColumns.${index}.columnName` as const, {
                      required: true,
                      pattern: /^\s*.*\S.*\s*$/,
                    })}
                  />
                  <button
                    className="mt-4 min-w-[15px]"
                    title="Delete Column"
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
            onClick={() => append({ columnName: "", columnId: "" })}
          >
            + Add New Column
          </Button>
        </div>
        <Button type="submit" color="primary" size="large" className="w-full">
          {mode === "add" ? "Create New Board" : "Save Changes"}
        </Button>
      </form>
    </Modal>
  );
}
