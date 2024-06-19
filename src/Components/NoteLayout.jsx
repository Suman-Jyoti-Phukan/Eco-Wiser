import Note from "./Note";
import NoteEditor from "./NoteEditor";

function NoteLayout() {
  return (
    <section className="flex flex-col justify-center items-center space-y-10 ">
      <NoteEditor />
      <Note />
    </section>
  );
}

export default NoteLayout;
