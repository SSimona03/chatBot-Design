function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-12">
        <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
          Starter project ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          ChatBot Design
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
          React, TypeScript, and Tailwind CSS are installed. Start building by
          editing <code className="rounded bg-slate-800 px-2 py-1 text-cyan-300">src/App.tsx</code>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {['React', 'TypeScript', 'Tailwind CSS'].map((tool) => (
            <span
              key={tool}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
