import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './code-editor.css';
import Editor from '@monaco-editor/react';
// import prettier from 'prettier';
// import parser from 'prettier/parser-babel';
import {
  MonacoJsxSyntaxHighlight,
  getWorker,
} from 'monaco-jsx-syntax-highlight';
import React, { useRef, useCallback } from 'react';
import prettierFormat from '../plugins/prettier';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
  save(): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
  save,
}) => {
  const editorRef = useRef<any>();

  // const handleEditorDidMount: OnMount = (monacoEditor, monaco) => {
  //   editorRef.current = monacoEditor;
  // };

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );

    // editor is the result of monaco.editor.create
    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });
    // init highlight
    highlighter();

    editor.onDidChangeModelContent(() => {
      // content change, highlight
      highlighter();
    });

    return dispose;
  }, []);

  const onFormatClick = () => {
    const unformatted = editorRef.current.getValue();

    const formatted = prettierFormat(unformatted);

    editorRef.current.setValue(formatted);
    save();
  };

  // useEffect(() => {
  //   const unformatted = editorRef.current.getValue();

  //   const formatted = prettierFormat(initialValue);

  //   editorRef.current.setValue(formatted);
  // }, []);

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-secondary is-small'
        onClick={onFormatClick}
      >
        Preview
      </button>
      <Editor
        defaultValue={initialValue}
        onMount={handleEditorDidMount}
        onChange={onChange}
        height={'40vh'}
        defaultLanguage='typescript'
        theme='vs-dark'
        path={'file:///Projects.tsx'}
        options={{
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
    </div>
  );
};

export default CodeEditor;
