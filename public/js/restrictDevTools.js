(function () {
    // Disable right-click
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  
    // Disable developer tools shortcuts
    document.addEventListener("keydown", function (event) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  
      if (
        (isMac && event.metaKey && event.shiftKey && ["I", "J", "C"].includes(event.key)) || // Cmd+Shift+I/J/C
        (!isMac && event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(event.key)) || // Ctrl+Shift+I/J/C
        event.key === "F12" // F12 key
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  
    // Continuously detect DevTools
    function detectDevTools() {
      function devToolsCheck() {
        debugger; // Stops execution if DevTools is open
        setTimeout(devToolsCheck, 100);
      }
      devToolsCheck();
    }
  
    detectDevTools(); // Start the debugger loop
  })();
  