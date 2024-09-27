import { __c, __SYD , __p, __g , __u, createElement , __v} from "../../sydneyLib/sydneyDom_v2.js"

__SYD.sideNav = () =>
{
    const render  = () =>{
        const elements = __p(['sideNav','children'],[]);
        const result  = new Array();

        for(let i = 0; i < elements.length; i++)
        {
            result.push(__SYD.parentText_admin_nav(i))
        }

        return result;
    }
    return __c(
        'div',
        {
            style:`height:100vh;width:30%;max-width:350px;min-width:300px;position:${__p(['sideNav' , 'media'],false) === false ? 'static' : 'absolute'};top:0;left:0;display:flex;flex-direction:column;column-gap:15px;row-gap:20px;align-items:flex-start;padding:20px 5px;background: #fff;transform:translateX(${__p(['sideNav' , 'media'],false) === false ? 'calc(0% - 3px)' : (__p(['sideNav' , 'trans'],false) === false ? '-100%' : '0')});transition:transform linear .3s;z-index:1500;border-right:2px solid #cccccc;`
        },
        [
            __SYD.animator_loader({size:20 , cls:'nav_animator'}),
            __c(
                'i',
                {
                    style:`display:${__p(['sideNav' , 'media'],false) === false ? 'none' : 'block'};font-size:20px;text-align:center;height:20px;width:20px;position:absolute;top:5px;right:-5px;transform:translateX(100%);`,
                    class:`click ${__p(['sideNav','trans']) ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}` 
                },
                [

                ],{
                    events:{
                        onclick:() =>{
                            const state = __g('sideNav');
                            state.trans = state.trans ? false : true;
                            __u('sideNav' , {type:'a' , value:state})
                        }
                    }
                }
            ),
            createElement(
                'h1',
                {
                    style:'width:100%;text-align:center;text-decoration:underline;'
                },
                [
                    'PC BRANDS'
                ]
            ),
            createElement(
                'div',
                {
                    style:'padding:0 10px;padding-top:40px;display:flex;flex-direction:column;align-items:center;row-gap:15px;justify-content:center;width:100%'
                },
                [
                    __c(
                        'input' ,
                        {
                            style:'height:50px;width:100%;padding:0 10px;font-size:17px;font-weight:600;',
                            placeholder:'Enter Brand Name',
                            class:'thinBorder lightBorder_rad'
                        }
                    ),
                    createElement('div' , {style:'padding:20px;background:#171717;color:#fff;position:relative;font-size:14px;font-weight:700;' , class:'click'},['Create Brand' , __SYD.animator_loader({size:15 , cls:'create_brand_animator' , initDisplay:'none'})] , {
                        events:{
                            onclick:(e) =>{
                                const parent = e.target.parentElement;
                                const input = parent.querySelector('input');
                                switch(Number(input.value.length) > 0)
                                {
                                    case true:
                                        socket.send(JSON.stringify({
                                            post:'server',
                                            type:'add_admin_brand',
                                            data:input.value
                                        }))

                                        document.querySelector('.create_brand_animator').style.display = 'flex';
                                        e.target.style.color = 'rgba(255,255,255,.7)';
                                        e.target.style.background = 'rgb(23, 23, 23 , .7)';

                                        __v['animate_pop_up'].style.display = 'none';
                                    break;
                                    default:
                                        alert('Enter a brand name')
                                }
                            }
                        },
                        type:'create_brand_btn'
                    }),
                ]
            ),
            createElement(
                'div',
                {
                    style:"height:100%;overflow:scroll;padding:15px 10px;width:100%;display:flex;flex-direction:column;row-gap:10px;text-transform:capitalize;"
                },
                [
                    ...render()
                ]
            )
        ],
        {
            createState:{
                stateName:'sideNav',
                state:{trans:false , children:[] , media:false , cBrand:'hp'}
            },
            mediaQuery:{
                query:[{size:'<600px' , prop:{media:true}}],
                defState:{media:false}
            }
        }
    )
}

__SYD.parentText_admin_nav = (i) =>{
    return __c(
        'div' , {
            style:'padding:10px;width:100%;display:flex;flex-direction:column;row-gap:15px;'
        },
        [
            __c('p' , {style:'font-size:14px;font-weight:700;padding:15px 5px;background:#171717;text-align:center;color:#fff;',class:'click'} , [__p(['sideNav','children'],[])[i]] , {
                events:{
                    onclick:(e) =>{
                        const state = __g('sideNav');
                        state.cBrand = __p(['sideNav','children'],[])[i].toLowerCase();
                        __u('sideNav' , {type:'a' , value:state})

                        e.target.scrollIntoView();

                        const state2 = __g('mainDisplay_admin');
                        state2.pElem = [];
                        __u('mainDisplay_admin' , {type:'a' , value:state2})

                        socket.send(
                            JSON.stringify({
                                post:'server',
                                type:'admin_product_req',
                                brand:__p(['sideNav' , 'cBrand'],'hp')
                            })
                        )

                        document.querySelector('.main_board_animator').style.display = 'flex';
                        __v['animate_pop_up'].style.display = 'none';
                    }
                }
            }),
            __c(
                'div',
                {
                    style:`padding:15px 5px;display:${__p(['sideNav' , 'cBrand'],'hp').toLowerCase() === __p(['sideNav','children'],[])[i].toLowerCase() ? 'flex' : 'none'};column-gap:5px;justify-content:center;flex-wrap:wrap;text-decoration:none;row-gap:5px;`
                },
                [
                    createElement('div' , {style:'padding:10px;font-size:14px;background:orange;color:#fff;',class:'click'},['Edit Brand'],{
                        events:{
                            onclick:() =>{
                                const state = __g('edit_del_tab');
                                state.dis = 'flex';
                                state.cTab = 0;
                                state.edit.prevName = __p(['sideNav' , 'cBrand'],'hp').toLowerCase()
                                __u('edit_del_tab' , {type:'a' , value:state})
                            }
                        }
                    }),
                    createElement('div' , {style:'padding:10px;font-size:14px;background:red;color:#fff;',class:'click'},['Delete Brand'],{
                        events:{
                            onclick:() =>{
                                const state = __g('edit_del_tab');
                                state.dis = 'flex';
                                state.cTab = 1;
                                state.delete.cName = __p(['sideNav' , 'cBrand'],'hp').toLowerCase()
                                __u('edit_del_tab' , {type:'a' , value:state})
                            }
                        }
                    })
                ]
            )
        ]
    )
}