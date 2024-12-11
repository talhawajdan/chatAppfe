declare module 'react-quill' {
    import { Component } from 'react';
  
    interface QuillProps {
      value?: string;
      defaultValue?: string;
      onChange?: (value: string, delta: any, source: string, editor: any) => void;
      placeholder?: string;
      theme?: string;
      modules?: Record<string, unknown>;
      formats?: string[];
      readOnly?: boolean;
      bounds?: string | HTMLElement;
      scrollingContainer?: string | HTMLElement;
    }
  
    export default class ReactQuill extends Component<QuillProps> {}
  }
  