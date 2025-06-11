
const tools = [
  { icon: "✏️", label: "Add Text" },
  { icon: "🖊️", label: "Draw" },
  { icon: "📌", label: "Highlight" },
  { icon: "☑️", label: "Checkbox" },
  { icon: "🖼️", label: "Insert Image" },
  { icon: "📄", label: "Add Page" },
  { icon: "🗑️", label: "Erase" },
  { icon: "🖋️", label: "Sign Document" },
];

const ToolsSidebar = ({ activeTool, setActiveTool }) => {
  const handleSelect = (toolLabel) => {
    setActiveTool(toolLabel);
  };

  const handleKeyDown = (e, toolLabel) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTool(toolLabel);
    }
  };

  return (
    <div className=" w-64 h-full bg-gray-100 p-4 border-r shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">🧰 Tools</h2>
      <ul className="space-y-2 text-gray-800 text-sm" role="list">
        {tools.map((tool) => (
          <li
            key={tool.label}
            role="button"
            tabIndex={0}
            aria-pressed={activeTool === tool.label}
            className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-200 transition ${
              activeTool === tool.label ? "bg-blue-100 text-blue-700" : ""
            }`}
            onClick={() => handleSelect(tool.label)}
            onKeyDown={(e) => handleKeyDown(e, tool.label)}
          >
            <span className="text-lg" aria-hidden="true">{tool.icon}</span>
            <span className="ml-2">{tool.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolsSidebar;


