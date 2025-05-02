import Checkbox from "./Checkbox";

export default function DropdownMenu({
  headings,
  checkedState,
  toggleChecked,
  scrollToHeading,
}) {
  // Calculate mother checkbox state
  const allHeadings = [];
  const collectHeadings = (nodes) => {
    nodes.forEach((node) => {
      allHeadings.push(node);
      if (node.children) collectHeadings(node.children);
    });
  };
  collectHeadings(headings);

  const allChecked = allHeadings.every((node) => checkedState[node.id]);
  const someChecked = allHeadings.some((node) => checkedState[node.id]);
  const motherState = allChecked
    ? "checked"
    : someChecked
    ? "in-progress"
    : "unchecked";

  // Handle mother checkbox toggle
  const toggleMotherCheckbox = () => {
    setCheckedState((prev) => {
      const newState = { ...prev };
      allHeadings.forEach((node) => {
        newState[node.id] = !allChecked;
      });
      return newState;
    });
  };

  const renderMenu = (nodes, level = 0) => (
    <ul className={`ml-${level * 4}`}>
      {nodes.map((node) => (
        <li key={node.id} className="my-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={node.id}
              checked={checkedState[node.id] || false}
              onChange={toggleChecked}
              label=""
            />
            <span
              className="cursor-pointer hover:underline transition-transform duration-200 ease-in-out transform hover:scale-105"
              onClick={() => scrollToHeading(node.id)}
            >
              {node.text}
            </span>
          </div>
          {node.children && node.children.length > 0 && (
            <div>{renderMenu(node.children, level + 1)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4 bg-gray-100 rounded">
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={motherState === "checked"}
            onChange={toggleMotherCheckbox}
            className="h-5 w-5"
            ref={(el) => {
              if (el) {
                el.indeterminate = motherState === "in-progress";
              }
            }}
          />
          <span className={motherState === "checked" ? "text-green-600" : ""}>
            All Modules
          </span>
        </label>
      </div>
      {renderMenu(headings)}
    </div>
  );
}