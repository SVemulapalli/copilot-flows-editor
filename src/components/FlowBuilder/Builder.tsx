import ReactFlow, {
  Background,
  Node,
  OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useCallback, useEffect, useMemo, useState } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import { EndpointNode } from "./EndpointNode";
import AsideMenu from "./AsideMenu";
import { Mode, ModeProvider } from "../stores/ModeProvider";
import { TransformedPath } from "./types/Swagger";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ReactFlowBuilder() {
  const nodeTypes = useMemo(
    () => ({
      endpointNode: EndpointNode,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      endpointEdge: NodeEdge,
    }),
    []
  );
  const [isCodeSidebarOpen, setIsCodeSidebarOpen] = useState(false);
  function toogleCodeSidebar() {
    setIsCodeSidebarOpen(!isCodeSidebarOpen);
  }
  useEffect(() => {
    const codeToggler = document.getElementById(
      "show-code-btn"
    ) as HTMLButtonElement;

    codeToggler.addEventListener("click", toogleCodeSidebar);
    return () => {
      codeToggler.removeEventListener("click", toogleCodeSidebar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [nodes, , onNodesChange] = useNodesState<TransformedPath>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState<Mode>({
    type: "append-node",
  });
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  function HandleNodeClick(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    switch (node.type) {
      case "endpointNode":
        // if node already active and clicked again, switch to append. (user want to add another node)
        if (mode.type === "edit-node" && mode.node.id === node.id) {
          setMode({ type: "append-node" });
        } else {
          setMode({ type: "edit-node", node: node });
        }
    }
  }
  return (
    <ModeProvider value={{ mode, setMode }}>
      {isCodeSidebarOpen && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-slate-500/50 z-50">
            <div className="flex items-center justify-center w-full h-full p-5">
              <div className="max-w-md w-full min-h-fit bg-white aspect-square rounded flex flex-col">
                <header className="p-3 border-b border-b-gray-400 flex items-center justify-between">
                  <div>
                    <h2>Flow Code</h2>
                    <span>not the actual code</span>
                  </div>
                  <button
                    className=""
                    onClick={() => setIsCodeSidebarOpen(false)}
                  >
                    <Cross2Icon />
                  </button>
                </header>
                <div className="flex-1">
                  <textarea
                    className="outline-none h-full resize-none w-full p-3"
                    rows={4}
                  >
                    {JSON.stringify(nodes)}
                  </textarea>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex-1 w-full flex items-center">
        <AsideMenu />
        <div className="flex-1 h-full">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onEdgeClick={(event, edge) => {
              event.stopPropagation();
              setMode({
                type: "add-node-between",
                edge: edge,
              });
            }}
            onNodeClick={HandleNodeClick}
            edgeTypes={edgeTypes}
            maxZoom={1}
            minZoom={1}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            deleteKeyCode={[]}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ModeProvider>
  );
}
