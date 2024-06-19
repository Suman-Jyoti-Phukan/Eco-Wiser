import { NoteProvider } from "./Context/NoteContext";

import NoteLayout from "./Components/NoteLayout";

import Navbar from "./Components/Navbar";

import ErrorBoundary from "./Components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-900 text-zinc-100 font-sans no-scrollbar">
        <NoteProvider>
          <Navbar />
          <NoteLayout />
        </NoteProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
