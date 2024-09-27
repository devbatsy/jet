import { createElement, styleComponent, sydDOM , setStyle, mount, __SYD, __c} from "../../sydneyLib/sydneyDom_v2.js"
import "./adminNav.js"
import "./adminMain.js"

setStyle([
    {
        nameTag:'container',
        style:{
            height:'100vh',
            width:'100vw',
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            background:'#fff',
            padding:'0 2px',
            position:'relative',
            // fontFamily:'ubuntu',
            fontFamily:'"Poppins", sans-serif',
            overflowX:'hidden'
            // color:'#707070'
        }
    },
    {
        nameTag:'flexType',
        style:{
            display:'flex',
            justifyContent:'flex-start',
            alignItems:'center'
        }
    },
    {
        nameTag:'bg',
        style:{
            backgroundPosition:'center',
            backgroundSize:'contain',
            backgroundRepeat:'no-repeat'
        }
    }
])

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.container()
        },
        [
            sydDOM.sideNav(),
            sydDOM.mainDisplay_admin(),
            __SYD.edit_del_tab()
        ]
    )
}

__SYD.animator_loader = ({size = 20 , cls = '' , initDisplay = 'flex'} = {}) =>{
    return __c(
        'div',
        {
            style:`position:absolute;top:50%;left:50%;transform:translate(-50% , -50%);z-index:999;height:fit-content;width:fit-content;padding:10px;display:${initDisplay};align-items:center;justify-content:center;column-gap:${size/2}px;`,
            class:cls
        },
        [
            __c('div',{style:`min-height:${size}px;min-width:${size}px;border-radius:50%;background:rgba(157, 54, 157, 0.8);box-shadow:1.5px 0 0px #cccccc;` , class:'animate_ball1'}),
            __c('div',{style:`min-height:${size}px;min-width:${size}px;border-radius:50%;background:rgba(157, 54, 157, 0.8);box-shadow:1.5px 0 0px #cccccc;` , class:'animate_ball2'}),
            __c('div',{style:`min-height:${size}px;min-width:${size}px;border-radius:50%;background:rgba(157, 54, 157, 0.8);box-shadow:1.5px 0 0px #cccccc;` , class:'animate_ball3'}),
        ]
    )
}

__SYD.pop_up_tab = () =>{
    return __c(
        'div',
        {
            style:'height:fit-content;padding:20px 15px;width:90%;max-width:400px;box-shadow:0 0 3px #171717;border-radius:5px;position:absolute;top:calc(100% + 40px);right:0;z-index:999;background:#cccccc;transform:translateX(calc(100% + 5px));display:none;justify-content:center;align-items:center;font-size:12px;font-weight:700;text-transform:capitalize;color:#9d369d',
            class:"animate_pop_up"
        },[
            // 'hello world , this is some text i wrote here'
        ],
        {
            type:'animate_pop_up'
        }
    )
}

mount(sydDOM.container())