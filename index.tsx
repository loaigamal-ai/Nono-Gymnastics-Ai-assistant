<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نونو مساعد اكاديمية نور للجمباز الذكي</title>
    
    <!-- ... باقي ال meta tags ... -->
    
    <script type="importmap">
    {
      "imports": {
        "@google/genai": "https://aistudiocdn.com/@google/genai@^1.29.1",
        "react/": "https://aistudiocdn.com/react@^19.2.0/",
        "react": "https://aistudiocdn.com/react@^19.2.0", 
        "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
      }
    }
    </script>
  </head>
  <body class="bg-gray-100">
    <div id="root"></div>
    
    <!-- غير المسار لـ ./App.tsx -->
    <script type="module">
      import React from 'react'
      import ReactDOM from 'react-dom/client'
      import App from './App.tsx'

      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(React.StrictMode, null, 
          React.createElement(App)
        )
      )
    </script>
  </body>
</html>
