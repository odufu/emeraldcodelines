import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DropdownMenu from "./components/DropdownMenu";

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [headings, setHeadings] = useState([]);
  const [checkedState, setCheckedState] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch markdown
  useEffect(() => {
    fetch("/sample.md")
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error("Error:", err));
  }, []);

  // Parse headings and add IDs
  useEffect(() => {
    const lines = markdown.split("\n");
    const headingStack = [];
    const headingTree = [];
    let currentId = 0;

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = `h-${currentId++}`;
        const node = { id, text, level, children: [] };

        while (
          headingStack.length > 0 &&
          headingStack[headingStack.length - 1].level >= level
        ) {
          headingStack.pop();
        }

        if (headingStack.length === 0) {
          headingTree.push(node);
        } else {
          headingStack[headingStack.length - 1].children.push(node);
        }

        headingStack.push(node);
      }
    });

    setHeadings(headingTree);
  }, [markdown]);

  // Handle checkbox toggle
  const toggleChecked = (id) => {
    setCheckedState((prev) => {
      const newState = { ...prev };
      newState[id] = !newState[id];

      const updateParents = (nodes) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            updateParents(node.children);
            const allChildrenChecked = node.children.every(
              (child) => newState[child.id]
            );
            newState[node.id] = allChildrenChecked;
          }
        });
      };

      updateParents(headings);

      const preventParentUncheck = (nodes) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            const anyChildChecked = node.children.some(
              (child) => newState[child.id]
            );
            if (anyChildChecked) {
              newState[node.id] = true;
            }
            preventParentUncheck(node.children);
          }
        });
      };

      preventParentUncheck(headings);

      return newState;
    });
  };

  // Scroll to heading with animation
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    const contentArea = document.querySelector(".markdown-content");
    if (element && contentArea) {
      const elementRect = element.getBoundingClientRect();
      const contentRect = contentArea.getBoundingClientRect();
      const offset = elementRect.top - contentRect.top + contentArea.scrollTop;
      contentArea.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Generate modified markdown with IDs
  const markdownWithIds = () => {
    const lines = markdown.split("\n");
    let currentId = 0;
    return lines
      .map((line) => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (match) {
          const id = `h-${currentId++}`;
          return `${match[1]} ${match[2]} {#${id}}`;
        }
        return line;
      })
      .join("\n");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed General Header */}
      <header className="bg-blue-600 text-white text-center py-4 fixed top-0 left-0 right-0 z-10">
        <h1 className="text-3xl font-bold">E-Learning Notes</h1>
      </header>
      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Fixed Collapsible Sidebar */}
        <div
          className={`bg-gray-50 p-4 transition-all duration-300 ease-in-out fixed top-16 bottom-0 z-10 ${
            isSidebarOpen ? "w-1/4" : "w-0"
          } overflow-hidden`}
        >
          <div className={isSidebarOpen ? "block" : "hidden"}>
            <h2 className="text-xl font-bold mb-4">Course Modules</h2>
            <DropdownMenu
              headings={headings}
              checkedState={checkedState}
              toggleChecked={toggleChecked}
              scrollToHeading={scrollToHeading}
            />
          </div>
        </div>
        {/* Scrollable Content Area */}
        <div
          className={`markdown-content p-8 overflow-y-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-[25%] w-3/4" : "ml-0 w-full"
          }`}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <button
            onClick={toggleSidebar}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          </button>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  id={props.id}
                  className="text-3xl font-bold mt-6 mb-4"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  id={props.id}
                  className="text-2xl font-semibold mt-5 mb-3"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  id={props.id}
                  className="text-xl font-medium mt-4 mb-2"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <pre className="bg-gray-100 p-4 rounded">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-100 px-1 rounded" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdownWithIds()}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
