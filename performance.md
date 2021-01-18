
## 部署后的性能优化

1. IIS配置缓存/增加GZIP压缩

2. 载入第三方字体时，启用 font-display 特性

https://web.dev/font-display/?utm_source=lighthouse&utm_medium=devtools

https://web.dev/preload-optional-fonts/

3. 缩短调用链：暂时移除 log.js文件

4. 图片增加默认宽高，减少页面抖动

https://web.dev/optimize-cls/?utm_source=lighthouse&utm_medium=devtools#images-without-dimensions

```html
<style>
    img {
        aspect-ratio: attr(width) / attr(height);
    }
</style>

<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons">
```

5. 增加缓存时长为365天

```httpd.conf
<IfModule expires_module>

    #打开缓存
    #文件缓存 A31536000/3600/24=365天

    ExpiresActive on 

    ExpiresByType text/css A31536000 
    ExpiresByType application/x-javascript A31536000 
    ExpiresByType application/javascript A31536000 
    # ExpiresByType text/html A31536000 
    ExpiresByType image/jpeg A31536000 
    ExpiresByType image/gif A31536000 
    ExpiresByType image/png A31536000 
    ExpiresByType image/x-icon A31536000 
	ExpiresByType application/x-font-ttf A31536000  
	ExpiresByType image/svg+xml A31536000
	ExpiresByType image/webp A31536000 
</IfModule>
```

6. preload

```html
    <link rel="preload" href="/fonts/Unica-One.ttf"/>
```

7. 代码分割

拆分包大小，按需引用 (尽量减少文件的交叉依赖)

参考资料： https://reactjs.org/docs/code-splitting.html

```ts

// BAD
// g2plot.ts
export {palette} from './palette'
export * from './index'

// index.ts
import palette from '@/component/g2plot'

//  ---

// GOOD
import { palette } from '@/component/g2plot/palette';
```

React.lazy 目前只支持默认导出（default exports）。如果你想被引入的模块使用命名导出（named exports），你可以创建一个中间模块，来重新导出为默认模块。这能保证 tree shaking 不会出错，并且不必引入不需要的组件。

```tsx
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;

// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";

// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```

8. 其它细节

useMemo

事件响应，rerender



9. 使用 React.lazy

参考资料： https://reactjs.org/docs/code-splitting.html

```tsx
    const ReactCounter = React.lazy(()=>import('./react_counter')); 
    export default ()=>(<div> 
        <Suspense fallback={<div>加载中</div>}>
            <ReactCounter/>
        </Suspense>
    </div>)

```

10. 使用 import

```tsx
export default ()=>{ 
    const onSave = async ()=>{
       const {saveAs} = await import('file-saver');
       saveAs(/** 存储逻辑 */)
    } 
    return <div onClick={onSave}>存储为</div>
}

```

11.不推荐的生命周期

推荐阅读： https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html

class 组件生命周期：

> componentWillReceiveProps (18.0中废弃)

> componentDidMount (18.0中废弃)

> 不推荐使用：getDerivedStateFromProps

常见模式如下，将state作为props的值缓存，建议直接由props处理

``` tsx
// BAD
export default Class Index extends React.Component{
    state = {
        value: ''
    } 
    getDerivedStateFromProps(nextProps,state){
        if(nextProps.value !== state.value){
            return {
                value:nextProps.value
            }
        }
    } 
    render(){ 
        return <div>
            <input value={state.value} onChange={e=>this.setState({
                value:e.target.value
            })}/>
        </div> 
    }
}  
```

``` tsx
// GOOD
export default Class Index extends React.PureComponent{ 
    render(){ 
        return <div>
            <input value={this.props.value} onChange={e=>this.props.onChange({
                value:e.target.value
            })}/>
        </div> 
    }
}  
```

12. 调整 handsontable

移除 plugins/index.ts 中  不使用公式
```ts 
import Formulas from './formulas/formulas';
```

---

## 单元测试相关

1. travis 中授权 git oAuth2
2. 项目中添加 .travis.yml 文件，示例

```yaml
language: node_js
node_js:
  - '14'
sudo: required
before_script:
  - npm install
script: npm run test:coveralls 
```

package.json
``` json 
{
    "scripts":{
        "test:coveralls": "umi test --online | coveralls",
    }
} 
```

3. git推送代码 ———— travis 自动测试 ———— 测试结果传送至  coveralls

4. coveralls.io 绑定 git
5. 增加文件 .coveralls.yml
```yaml
service_name: travis-pro
repo_token: 你项目的token
```
6. coveralls中自动显示测试覆盖率

---

## 快照测试

参考资料： https://jestjs.io/docs/en/tutorial-react#snapshot-testing