//reactElement类
function ReactElement(type,props){//react元素
    this.type=type;
    this.props = props;
  }
  
function createElement(type,props,...children){//...children是将剩余的参数变成数组
    if(children.length===1) children = children[0];
    return new ReactElement(type,{...props,children:children});
}

//render方法
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