import InfiniteViewer, * as modules from './index';

// for (const name in modules) {
//     (InfiniteViewer as any)[name] = modules[name];
// }
Object.entries(modules).forEach(([name, moduleFn]) => {
  (InfiniteViewer as any)[name] = moduleFn;
});

export default InfiniteViewer;
