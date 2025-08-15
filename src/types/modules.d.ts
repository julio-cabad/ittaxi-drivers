declare module 'react-native-vector-icons/MaterialIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}

declare module '@react-native-documents/picker' {
  export interface DocumentPickerResponse {
    uri: string;
    name: string;
    type: string;
    size: number;
  }
  
  export interface DocumentPickerOptions {
    type?: string[];
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  }
  
  export function pick(options?: DocumentPickerOptions): Promise<DocumentPickerResponse>;
  export function pickMultiple(options?: DocumentPickerOptions): Promise<DocumentPickerResponse[]>;
  export function isCancel(err: unknown): boolean;
}