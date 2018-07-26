# lesson1

**完成情况**
```javascript
//App调试结果，jsx编译成为
ReactElement {
    type: "div", 
    props:{
        children: "test"
    }
}
```

<hr/>

```javascript
//jsx编译后的数据结构嵌套存储方法
function ReactElement(type,props){//react元素
  this.type=type;
  this.props = props;
}
function createElement(type,props,...children){//...children是将剩余的参数变成数组
  if(children.length===1) children = children[0];
  return new ReactElement(type,{...props,children:children});
}
/**
 * 
 * 例如： createElement(                                    
            "h1",
            {id:'hh11'},
            'jiyao',                            
            createElement(
                'h2',
                {className:'sanpao'},
                'xie'
            )
        )
        会被转换成
        {"type":"h1","props":{"id":"hh11","children":["jiyao",{"type":"h2","props":{"className":"sanpao","children":"xie"}}]}}
 * **/
```
<hr/>

```javascript
//render方法实现，解析jsx嵌套结构完成渲染
function myrender(jsx,container){
  let {type,props} = jsx;
  let ele = document.createElement(type);
  for(let key in props){
    if(key==='children'){
      if(typeof props[key]==='object'){
        //arr
        props[key].forEach(item=>{
          if(typeof item === 'object'){
            myrender(item,ele);
          }else{
            ele.appendChild(document.createTextNode(item));
          }
        })
      }else{
        //str
        ele.appendChild(document.createTextNode(props[key]));
      }
    }else if(key === 'className'){
      ele.setAttribute('class',props[key]);
    }else if(key.startsWith('on')){
      let eventType = key.toLowerCase().replace('on','');
      ele.addEventListener(eventType,props[key],false);
    }else{
      ele.setAttribute(key,props[key]);
    }
  }
  container.appendChild(ele);
}
/**
 * 思路：第一步可以确定的是解析嵌套对象只有两个属性，type和props
 *      第二步进行dom操作创建这个dom
 *      第三步进行遍历props属性，对便利出来的属性进行判断。如果是children则进行类型判断，遍历后再次进行类型判断
 *          这里首先分了两种情况，第一种是children是一个数组，第二种是children直接是一个字符串。第二种情况直接创建文本节点插入到新建的dom中就好了
 *          第一种情况又需要遍历然后区分是对象还是字符串，如果是字符串还是直接新建文本节点然后插入。如果还是一个对象的话就证明是子元素，需要进行递归
 *          在这里递归需要传入的当然就是新发现的子元素对象和当前创建的dom
 *      这里有一种特殊情况需要区分，由于jsx的特殊性质在类名的定义中需要使用className来代替class关键字
 *      当然如果是普通属性的话直接setAttribute就好
 * 
 *      这里简单处理了一下事件的逻辑。。意思就是判断属性（props[key]）中有没有包含on的属性。如果有的话，采用事件监听的方式（这里没有考虑addEventListener的兼容性问题）绑定事件。
 *      
 * 
 *      更新还没来得及做，这几天有点忙，等周六日有时间了思考下。
 * **/
```