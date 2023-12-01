// Execute the script when the element is clicked (assuming you have an element to click)
document.getElementById("yourElementId").addEventListener("click", execScript);

async function execScript() {
  const tabId = await getTabId();
  
  // Inject the script directly into the DOM
  const script = document.createElement('script');
  script.src = "colorblind_opt.js";
  document.head.appendChild(script);
}

async function getTabId() {
  // In a web page, we don't have access to Chrome tabs, so we'll need to adjust
  // this function based on your requirements (e.g., querying the DOM for the current tab).
  // For simplicity, I'll just return a placeholder object.
  return { id: 1 };
}
