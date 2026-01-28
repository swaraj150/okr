export default function App() {
  return (
    <>
      <div className="flex w-full min-h-screen justify-center items-center border  font-mono bg-gray-300 ">
        <div className={"absolute top-20  text-2xl font-bold"}>
            <p className={"font-bold text-5xl"}>OKR Form</p>
        </div>
        <form
          className={"flex flex-col w-[400px] h-auto gap-5 p-10 border rounded-md shadow-xl bg-gray-100"}
          onSubmit={() => {}}
        >
            
          <div className="flex flex-col item-center justify-center  gap-2">
            <label htmlFor="objective">Add an Objective</label>
            <input
              type="text"
              className={" border rounded-md  border"}
              name="objective"
            />
          </div >
          <div className="flex flex-col item-center gap-2">
            <label htmlFor="keyResult">Add a Key Result</label>
            <input
              type="text"
              className={" border rounded-md  border"}
              name="keyResult"
            />
          </div>

          <div className={"flex gap-4 justify-center"}>
            <button
              className={"border rounded-md px-3 py-1 bg-blue-500 text-white"}
            >
              Submit
            </button>
            <button
              type="reset"
              className={"border rounded-md px-3 py-1 bg-gray-300"}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
