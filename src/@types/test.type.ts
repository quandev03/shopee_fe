import { ReactElement } from 'react';

export type TestScreenProps = {
  title: string;
  document: { wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>; ui: ReactElement };
  testFn: () => Promise<void>;
};
