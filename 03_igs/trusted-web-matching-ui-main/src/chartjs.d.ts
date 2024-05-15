// import { ChartOptions } from 'chart.js';

// declare module 'chart.js' {
//   interface ChartOptions {
//     naDisplayOptions?: boolean[];
//   }
// }

import { ChartType } from 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    na_display_plugin?: {
      conditions: boolean[];
    };
  }
}
