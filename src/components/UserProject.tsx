import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Accordion } from 'react-bootstrap';
import './UserProject.css';
import { unpkgPathPlugin } from '../plugins/unpackage-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';
import * as esbuild from 'esbuild-wasm';
import { GeneralObject } from '../App';

const UserProject = ({ proj }: GeneralObject) => {
  const iframe = useRef<any>();
  const ref = useRef<any>();

  const html = `
  <html>
    <body>
      <div id='root'></div>
      <script>
        window.addEventListener('message', (event) => {
          try{
            eval(event.data)
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
            console.err(err)
          }
        }, false);
      </script>
    </body> 
  </html>
`;

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const format = async () => {
    if (!ref.current) {
      return;
    }
    iframe.current.srcDoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(proj.code)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  useEffect(() => {
    startService();
    // getProject();
  }, []);
  return (
    <div className='project'>
      <h4 id='name'>{proj.name}</h4>
      <Accordion className='accordian'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>ReadMe</Accordion.Header>
          <Accordion.Body className='body'>
            <p>{proj.readme}</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion className='accordian'>
        <Accordion.Item eventKey='1'>
          <Accordion.Header>Code</Accordion.Header>
          <Accordion.Body className='body'>
            <button
              className='button button-format is-secondary is-small'
              onClick={format}
            >
              Preview
            </button>
            <Editor
              defaultValue={proj.code}
              height={'40vh'}
              defaultLanguage='typescript'
              theme='vs-dark'
              path={'file:///Projects.tsx'}
              options={{
                readOnly: true,
                wordWrap: 'on',
                minimap: { enabled: false },
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 16,
                scrollBeyondLastLine: false,
                lineHeight: 28,
                automaticLayout: true,
              }}
            />
            <div id='results'>
              <iframe
                id='iframe'
                title='preview'
                ref={iframe}
                sandbox='allow-scripts'
                srcDoc={html}
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default UserProject;
