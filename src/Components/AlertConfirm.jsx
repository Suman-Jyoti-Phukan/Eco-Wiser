/* eslint-disable react/prop-types */
import { Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import Spinner from "./Spinner";

function AlertConfirm({ removeNote, deleteData, id, isLoading }) {
  return (
    <AlertDialog>
      {/* Render the button asChild so it doesnot conflict with the
  child button   */}
      <AlertDialogTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        {/* <Button> */}
        <p className="p-3 rounded-full hover:bg-zinc-800  transition-all ease-in delay-100 text-slate-100">
          <Trash className="text-slate-100" size={18} />
        </p>
        {/* </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-neutral-950 text-slate-300 max-w-[23rem] sm:max-w-[30rem]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-red-500 text-slate-100 
        hover:bg-red-600 hover:text-slate-100 border-red-200"
            onClick={(e) => e.stopPropagation()}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              removeNote(id);
              deleteData(id);
            }}
            className="bg-red-500 text-slate-100 
        hover:bg-red-600 hover:text-slate-100 border border-red-200"
          >
            {isLoading ? <Spinner /> : <span>Continue</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirm;
