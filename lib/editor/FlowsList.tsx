import { useState } from "react";
import {
  ChevronRightIcon,
  CubeIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useController } from "../stores/Controller";
import { useMode } from "../stores/ModeProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  EmptyState,
} from "../components";
import { cn } from "../utils";
import { useSettings } from "../stores/Config";

export function FlowsList() {
  const [flowsPanelOpened, setFlowsPanel] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { reset } = useMode();
  const { maxFlows } = useSettings();
  const {
    createFlow,
    state: { flows, activeFlowId },
    setActiveFlow,
    deleteFlow,
  } = useController();
  console.log(flows.length);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const [name, description, focus] = [
      data.get("name"),
      data.get("description"),
      data.get("focus"),
    ];
    if (name && description) {
      if (maxFlows && flows.length <= maxFlows) {
        createFlow({
          createdAt: Date.now(),
          name: name.toString(),
          description: description.toString(),
          focus: focus === "on" ? true : false,
        });
        setModalOpen(false);
      } else {
        alert("You have reached the maximum number of flows");
      }
    }
  }
  return (
    <div className="block absolute transition bottom-0 inset-x-0 bg-white shadow-lg">
      <div className="flex items-center justify-between border-y-4 border-neutral-100 px-2 py-1">
        <button
          className="flex-1 space-x-2 text-sm uppercase text-start font-semibold"
          onClick={() => setFlowsPanel((pre) => !pre)}
        >
          <ChevronRightIcon
            className={cn(
              "text-base inline transition-transform",
              flowsPanelOpened ? "rotate-0" : "rotate-90"
            )}
          />
          <span>flows</span>
        </button>
        <Dialog open={modalOpen} onOpenChange={(e) => setModalOpen(e)}>
          <DialogContent className="h-fit">
            <DialogHeader className="text-lg font-semibold">
              New Flow
            </DialogHeader>
            <form onSubmit={onSubmit}>
              <label htmlFor="name-input">Name</label>
              <input
                required
                id="name-input"
                defaultValue={"New Flow"}
                className="block text-sm font-medium rounded border border-stone-300 w-full p-2 text-stone-800 mb-4"
                type="text"
                name="name"
              />
              <label htmlFor="name-input">Description</label>
              <input
                required
                defaultValue={"A flow that does something"}
                id="description-input"
                className="block text-sm font-medium rounded border border-stone-300 w-full p-2 text-stone-800"
                type="text"
                name="description"
              />
              <div className="mt-2 space-x-1">
                <input
                  type="checkbox"
                  id="focus-input"
                  className="inline"
                  defaultChecked
                  name="focus"
                />
                <label htmlFor="focus-input" className="inline">
                  Focus after creation?
                </label>
              </div>
              <div className="w-full flex items-center justify-end mt-4">
                <button
                  type="submit"
                  className="px-2 py-1 rounded text-base font-semibold bg-indigo-500 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </DialogContent>
          <DialogTrigger asChild>
            <button>
              <PlusIcon className="text-base" />
            </button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div
        className={cn(
          "block transition-all overflow-auto",
          flowsPanelOpened
            ? "h-52 animate-in fade-in"
            : "h-0 animate-out fade-out"
        )}
      >
        {flows.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-1 p-2">
            {flows?.map((flow, i) => {
              const isActive = flow.id === activeFlowId;
              return (
                <li key={flow.id} data-flow-id={flow.id}>
                  <div
                    className={cn(
                      "flex items-center text-base rounded-md w-full text-left justify-between font-semibold p-2 transition-all duration-300 ease-in-out hover:bg-slate-100",
                      isActive ? "bg-slate-100" : ""
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <CubeIcon className="inline" />
                      <span>{flow.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <button
                        title="edit this flow"
                        onClick={() => {
                          if (isActive) return;
                          setActiveFlow(flow.id);
                          reset();
                        }}
                        className="text-slate-500"
                      >
                        <Pencil1Icon />
                      </button>
                      <button
                        className="text-rose-500"
                        onClick={() => {
                          confirm(
                            "Are you sure you want to delete this flow?"
                          ) && deleteFlow(flow.id);
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
