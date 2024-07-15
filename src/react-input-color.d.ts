declare module 'react-input-color' {
    import * as React from 'react';
  
    interface InputColorProps {
      initialValue?: string;
      onChange?: (color: { hex: string }) => void;
      placement?: 'top' | 'bottom' | 'left' | 'right';  
        disabled?: boolean;
        style?: React.CSSProperties;
        title?:string;

    }
  
    const InputColor: React.FC<InputColorProps>;
  
    export default InputColor;
  }
  