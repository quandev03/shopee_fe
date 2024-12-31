import { defaultNS, resources } from 'src/i18n/i18n';
import 'i18next';

declare module 'i18next' {
  //Kế thừa để thêm vào type
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['vi']; //Dựa theo ngôn ngữ mặc định;
  }
}
