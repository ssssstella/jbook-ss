import React, { useEffect, useRef } from 'react';
import './Preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
  <html>
    <head>
      <style>html {background-color: white;}</style>
    </head>
    <body>
      <div id='root'></div>
      <script>
        const handleError = (err) => {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            throw err;
        };

        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            handleError(err);
          }
          
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  
  const iframe = useRef<any>(null);

  useEffect(() => {
    iframe.current.srcDoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50)
    
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        srcDoc={html}
        sandbox="allow-scripts"
        ref={iframe}
      />
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
