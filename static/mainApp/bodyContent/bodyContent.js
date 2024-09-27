import {
    createElement,
    virtualDom,
    mount,
    styleComponent,
    setStyle,
    sydDOM,
    getState,
    preState,
    useState
} from '../../../sydneyLib/sydneyDom.js'

import './bodySubNav.js';
import './bodySideNav.js';
import './mainDisplayPanel.js'

setStyle([
    {
        nameTag:'mainBodyContent',
        style:{
            // minHeight:'100%',
            width:'100%',
            background:'inherit',
            rowGap:'20px',
            paddingBottom:'80px',
            position:'relative',
            height:'fit-content',
            background:'#fff',
            margin:'15px 0',
            borderRadius:'20px',
            boxShadow:'0 0 5px rgba(0,0,0,.25)'
        }
    },
    {
        nameTag:'titleText',
        style:{
            fontSize:'25px',
            fontWeight:'700',
            textTransform:'capitalize',
            padding:'5px'
        }
    },
    {
        nameTag:'floatBodyContent_',
        style:{
            height:'100%',
            width:'100%',
            // background:'#fff',
            padding:'15px',
            overflow:'scroll',
            paddingBottom:'100px',
            // display:'flex'
        }
    },
    {
        nameTag:'menuList',
        style:{
            lineHeight:'60px',
            borderBottom:'1px solid #333',
            width:'100%',
            textAlign:'left',
            textTransform:'capitalize',
            paddingLeft:'5px',
            fontSize:'20px',
            fontWeight:'500',
            // outline:'none'
        }
    }
])

sydDOM.mainBodyContent = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.mainBodyContent() + styleComponent.flexType([
                {method:'add',style:{flexDirection:'column',alignItems:'flex-start',border:'none'}}
            ]),
            class:'direct-child'
        },
        [
            sydDOM.navChoice(),
            sydDOM.bodyHeader(),
            sydDOM.largeImageDisplay(),
            sydDOM.bodySubNav(),
            sydDOM.mainDisplayPanel()
        ]
    )
}

sydDOM.navChoice = () =>{
    return createElement(
        'div',
        {
            style:'background:#fff;width:100%;column-gap:10px;margin-top:20px;text-transform:capitalize;' + styleComponent.flexType()
        },
        [
            createElement('p',{},['Home']),
            createElement('i',{style:'font-size:12px',class:"fa-solid fa-angles-right"},[]),
            sydDOM.currentNavChoice()
        ]
    )
}

sydDOM.currentNavChoice = () =>{
    return createElement(
        'p',
        {},
        [
            preState(['currentNavChoice','text'],category)
        ],
        {
            createState:{
                stateName:'currentNavChoice',
                state:{text:'test'}
            },
            type:'currentNavChoice'
        }
    )
}

sydDOM.bodyHeader = () =>{
    return createElement(
        'p',
        {
            style:styleComponent.titleText()
        },
        [
            preState(['bodyHeader','text'],`${category} devices`),createElement('i',{style:'margin-left:15px',class:"fa-solid fa-laptop"})
        ],
        {
            createState:{
                stateName:'bodyHeader',
                state:{text:'hp laptops'}
            },
            type:'bodyHeader'
        }
    )
}

sydDOM.largeImageDisplay = () =>{
    togBodySideNav = () =>{
        const bodySideNav = getState('bodySideNav');
        const container = getState('container');
        bodySideNav.d = 'flex';
        // container.ov = 'hidden'
        useState('bodySideNav',{type:'a',value:bodySideNav});
        useState('container', {type:'a',value:container})
        virtualDom['bodySideNav_child'].focus()
    }
    return createElement(
        'div',
        {
            style:'width:100%;height:100%;max-height:400px;min-height:400px;position:relative;background:#702670'
        },
        [
            createElement(
                'p',
                {
                    style:'font-weight:300;padding:10px 5px;cursor:pointer;width:fit-content;position:absolute;bottom:20px;right:20px;color:#fff',
                    onclick:'togBodySideNav()'
                },
                [
                    'show filters'
                ]
            )
        ]
    )
}

sydDOM.floatBodyContent = () =>{
    togFloatBody = (type) =>{
        const floatBodyContent = getState('floatBodyContent');
        const container = getState('container');

        switch(true)
        {
            case floatBodyContent.controller !== type:

                container.ov = 'hidden';
                floatBodyContent.d = 'flex';
                floatBodyContent.controller = type;
                const timer = setTimeout(() => {
                    const floatBodyContent = getState('floatBodyContent');
                    floatBodyContent.o = '1';
                    useState('floatBodyContent',{type:'a',value:floatBodyContent})
                    clearTimeout(timer)
                }, 100);

            break;
            default:

                floatBodyContent.d = 'none';
                floatBodyContent.o = '0';
                floatBodyContent.controller = '';
                container.ov = 'scroll';

        }
        useState('floatBodyContent',{type:'a',value:floatBodyContent});
        useState('container', {type:'a',value:container})
    }

    // const selectRenderedElement = () =>{
        
    // }
    return createElement(
        'div',
        {
            style:`width:100%;display:${preState(['floatBodyContent','d'],'none')};opacity:${preState(['floatBodyContent','o'],'1')};left:50%;background:#fff;position:absolute;top:100%;transform:translateX(-50%);z-index:1100`,
            class:'floatBodyContent'
        },
        [
            sydDOM.floatBodyContent_Msearch(),
            sydDOM.floatBodyContent_cart1(),
            sydDOM.floatBodyContent_Mmenu()
        ],
        {
            createState:{
                stateName:'floatBodyContent',
                state:{d:'none',o:'0',controller:'',processRender:(type) =>{
                    const controller = preState(['floatBodyContent','controller'],'');
                    return controller === type;
                }}
            },
            type:'floatBodyContent'
        }
    )
}

sydDOM.floatBodyContent_Mmenu = () =>{
    const renderMenu = () =>{
        const elements = preState(['container' , 'jetBrands'],['hp' , 'dell' , 'lenovo' , 'acer' , 'apple']);
        const array = [];
        elements.forEach(val =>{
            array.push(
                createElement('a',{style:styleComponent.menuList(),class:'click',onclick:`loadDecForm("${val}")`},[`${val}`])
            )
        })
        
        return array;
    }
    return createElement(
        'div',
        {
            style:styleComponent.floatBodyContent_({
                method:'add',
                style:{
                    // background:'red',
                    display:preState(['floatBodyContent','processRender'],()=>{return false})('Mmenu') === true ? 'flex' : 'none',
                    flexDirection:'column'
                }
            })
        },
        [
            createElement(
                'ul',
                {
                    style:'list-style-type:none;display:flex;flex-direction:column'
                },
                [
                    // createElement('a',{style:styleComponent.menuList(),class:'click',onclick:'loadDecForm("hp")'},['hp']),
                    // createElement('a',{style:styleComponent.menuList(),class:'click',onclick:'loadDecForm("dell")'},['dell']),
                    // createElement('a',{style:styleComponent.menuList(),class:'click',onclick:'loadDecForm("acer")'},['acer']),
                    // createElement('a',{style:styleComponent.menuList(),class:'click',onclick:'loadDecForm("apple")'},['apple']),
                    // createElement('a',{style:styleComponent.menuList(),class:'click',onclick:'loadDecForm("lenovo")'},['lenovo']),
                    ...renderMenu()
                ]
            )
        ]
    )
}

sydDOM.floatBodyContent_cart1 = () =>{
    const renderElem = () =>{
        const data = preState(['floatBodyContent_cart1','cartInfo'],[]);
        const elements = new Array()
        for(let i = 0; i < data.length; i++)
        {
            elements.push(
                sydDOM.floatCart_tab({index:i})
            )
        }
        return elements
    }
    return createElement(
        'div',
        {
            style:styleComponent.floatBodyContent_({
                method:'add',
                style:{
                    // background:'blue',
                    display:preState(['floatBodyContent','processRender'],()=>{return false})('cart1') === true ? 'flex' : 'none',
                    flexDirection:'column',
                    rowGap:'10px',
                    alignItems:'center',
                    userSelect:'none',
                    position:'relative'
                }
            })
        },
        [
            createElement(
                'div',
                {
                    style:`height:100%;width:100%;position:absolute;background:rgba(255,255,255,.3);cursor:not-allowed;top:0;left:0;z-index:500;display:${webType !== 'advert' ? 'block' : 'none'}`
                }
            ),
            ...renderElem(),
            sydDOM.CartPageBelowPanel()
        ],{
            createState:{
                stateName:'floatBodyContent_cart1',
                state:{cartInfo:[]}
            },
            type:'floatBodyContent_cart1'
        }
    )
}

sydDOM.floatCart_tab = ({index}) =>{
    removeCart_elem = (index) =>{
        const floatBodyContent_cart1 = getState('floatBodyContent_cart1');
        const cart1 = getState('cart1')
        floatBodyContent_cart1.cartInfo.splice(index,1);
        cart1.cartItems = floatBodyContent_cart1.cartInfo.length;
        useState('floatBodyContent_cart1',{type:'a',value:floatBodyContent_cart1})
        useState('cart1',{type:'a',value:cart1})
    }
    return createElement(
        'div',
        {
            style:`height:100px;width:100%;display:flex;column-gap:10px;row-gap:10px;justify-content:center;padding:5px;align-items:center;position:relative;z-index:300;pointer-events:${webType === 'advert' ? 'auto' : 'none'}`
        },
        [
            createElement(
                'div',
                {
                    style:'height:80px;width:30%;max-width:120px',
                    class:'thinBorder'
                }
            ),
            createElement('p',{style:'width: 100%;text-align:left;transition:all linear .2s;font-size:16px;font-weight:500'},[
                createElement('p',{},[getcartInfo(index,'name')]),
                createElement('p',{style:'font-weight:600;margin-top:10px;font-size:15px;font-family:"Plus Jakarta Sans", sans-serif;'},['₦ '+getcartInfo(index,'price')]),
            ]),
            sydDOM.supplyCount({index:index}),
            createElement('i',{style:'height:10px;width:10px;font-size:10px;position:absolute;top:3px;right:3px;',class:"fa-solid fa-xmark click",onclick:`removeCart_elem(${index})`})
        ]
    )
}

sydDOM.supplyCount = ({index}) =>{
    addCartElem = (index,elem) =>{
        const floatBodyContent_cart1 = getState('floatBodyContent_cart1');
        console.log(floatBodyContent_cart1.cartInfo[index].price ,' this is the price');
        console.log(getTotalCart_elem() , 'this is the total elem')
        switch(floatBodyContent_cart1.cartInfo[index].price + getTotalCart_elem() < 500000)
        {
            case true:
                floatBodyContent_cart1.cartInfo[index].count++;
                elem.parentElement.children[0].style.opacity = '1'
                elem.parentElement.children[0].style.pointerEvents = 'unset'
            break;
            default:
                alert('Total transaction exceeded ₦500,000')
        }
        useState('floatBodyContent_cart1',{type:'a',value:floatBodyContent_cart1})
    }

    removeCartElem = (index,elem) =>{
        const floatBodyContent_cart1 = getState('floatBodyContent_cart1');
        switch(floatBodyContent_cart1.cartInfo[index].count !== 0)
        {
            case true:
                floatBodyContent_cart1.cartInfo[index].count--;
            break;
        }
        useState('floatBodyContent_cart1',{type:'a',value:floatBodyContent_cart1});

        if(floatBodyContent_cart1.cartInfo[index].count === 0)
            {
                removeCart_elem(index)
            }
    }

    return createElement(
        'div',
        {
            style:'height:50px;min-width:fit-content;display:flex;align-items:center;justify-content:space-between;padding:5px;column-gap:5px',
            class:'thinBorder'
        },
        [
            createElement('i',{class:"fa-solid fa-square-minus click smallClickBg",style:styleComponent.smallClickBox(),onclick:`removeCartElem(${index},this)`}),
            createElement('p',{style:'padding:5px;font-size:14px;min-width:30px;text-align:center'},[
                `${preState(['floatBodyContent_cart1','cartInfo'],[])[index].count}`
            ]),
            createElement('i',{class:"fa-solid fa-square-plus click smallClickBg",style:styleComponent.smallClickBox(),onclick:`addCartElem(${index},this)`}),
        ]
    )
}

sydDOM.CartPageBelowPanel = () =>{
    const bool = () =>{
        const floatBodyContent_cart1 = preState(['floatBodyContent_cart1','cartInfo'],[]);
        return floatBodyContent_cart1.length > 0 ? true : false
    }

    return createElement(
        'div',
        {
            style:'padding:10px;height:fit-content;width:100%;max-width:500px;display:flex;flex-direction:column;row-gap:10px;position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:400'
        },
        [
            sydDOM.subTotalDiv(),
            createElement(
                'div',
                {
                    style:`padding:10px 0;width:100%;background:#702670;color:#fff;font-weight:600;text-transform:capitalize;text-align:center;opacity:${bool() ? '1' : '.6'};cursor:${bool() ? 'pointer' : 'not-allowed'}`,
                    class:'click',
                    onclick:bool() ? `loadDecForm('${category}','checkout')` : ''
                },
                [
                    'checkout'
                ]
            )
        ]
    )
}

sydDOM.subTotalDiv = () =>{
    const getTotalCart = () =>{
        const floatBodyContent_cart1_el = preState(['floatBodyContent_cart1','cartInfo'],[]);
        let subTotal = 0
        for(let i = 0; i < floatBodyContent_cart1_el.length; i++)
        {
            subTotal += floatBodyContent_cart1_el[i].price * Number(floatBodyContent_cart1_el[i].count);
        }
        return `₦ ${subTotal}`
    }
    return createElement(
        'div',
        {
            style:'width:100%;display:flex;justify-content:space-between;align-items:center;row-gap:10px;font-weight:200;font-size:14px'
        },
        [
            'Subtotal',
            createElement('p',{style:'font-weight:600;'},[getTotalCart()])
        ]
    )
}

sydDOM.floatBodyContent_Msearch = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.floatBodyContent_({
                method:'add',
                style:{
                    // background:'pink',
                    display:preState(['floatBodyContent','processRender'],()=>{return false})('Msearch') === true ? 'flex' : 'none',
                    flexDirection:'column',
                    alignItems:'center'
                }
            })
        },
        [
            sydDOM.searchTab2()
        ]
    )
}

sydDOM.searchTab2 = () =>{
    const render = () =>{
        const children = preState(['searchTab2' , 'children'],[])
        const output = []
        for(let i = 0; i < children.length; i++)
        {
            output.push(
                sydDOM.searchTab2Menu_items(i)
            )
        }

        return output;
    }
    return createElement(
        'div',
        {
            style:'height:50px;width:100%;max-width:450px;position:relative',
            tabindex:'1',
            onblur:'blur_searchTab2_pop_up()'
        },
        [
            createElement(
                'input',
                {
                    style:sydDOM.searchTab1Input().inherit(['attribute','style']),
                    oninput:`searchTab2Input_input.bind()(this)`
                }
            ),
            createElement(
                'div',
                {
                    style:sydDOM.searchTab1Button().inherit(['attribute','style'])
                }
            ),
            createElement(
                'div',
                {
                    style:`height:fit-content;max-height:400px;width:100%;background:#fff;box-shadow:0 0 5px rgba(0,0,0,.4);position:absolute;top:calc(100% + 5px);left:0;padding:10px;display:${preState(['searchTab2','popUp'],false) ? 'flex' : 'none'};justify-content:flex-start;align-items:center;flex-direction:column;row-gap:10px;overflow:scroll;padding-top:20px;`,
                    // tabindex:'1',
                    // onblur:'blur_searchTab2_pop_up()'
                },
                [
                    createElement(
                        'i',
                        {
                            style:'height:20px;width:20px;font-size:20px;position:absolute;top:5px;right:5px;',
                            class:'fa-solid fa-xmark click',
                            onclick:'blur_searchTab2_pop_up()'
                        }
                    ),
                    ...render()
                ],
                {
                    type:'searchTab2_pop_up'
                }
            )
        ],
        {
            createState:{
                stateName:'searchTab2',
                state:{ children:[] , popUp:false}
            },
            type:'searchTab2'
        }
    )
}

searchTab2Input_input = (elem) =>{
    const children = preState(['mainDisplayPanel','children'],[]);
    const valid = children.filter(val =>{return val.name.toLowerCase().includes(elem.value.toLowerCase())});

    const state = getState('searchTab2');

    if(/\w{1,}/.test(elem.value))
    {
        state.children = valid;
        state.popUp = true;
        // virtualDom['searchTab2_pop_up'].focus();
    }else{
        state.children = [];
        state.popUp = false;
    }

    useState('searchTab2' , {type:'a' , value:state})
}

blur_searchTab2_pop_up = () =>{
    const state = getState('searchTab2');
    state.popUp = false;
    useState('searchTab2' , {type:'a' , value:state})
}

sydDOM.searchTab2Menu_items = (id) =>{
    const orginalIndex = preState(['mainDisplayPanel','children'],[]).filter(val =>{return val.id === preState(['searchTab2','children'],[])[id].id});

    const index = preState(['mainDisplayPanel','children'],[]).indexOf(orginalIndex[0]);

    const img = preState(['mainDisplayPanel','children'],[])[index] === undefined ? '' : preState(['mainDisplayPanel','children'],[])[index].productImg
    return createElement(
        'div',
        {
            style:'min-height:70px;width:100%;border-bottom:2px solid #cccccc;display:flex;column-gap:20px;padding:5px;',
            onclick:`inspect(${index})`,
            class:"click"
        },[
            createElement('div',{style:`height:60px;min-width:60px;border-radius:50%;background-image:url('${img}');`+styleComponent.bg({method:'add' , style:{backgroundSize:'cover'}})}),
            createElement('p', {style:'text-transform:capitalize;font-size:14px;font-weight:600;display:flex;align-items:center;width:100%;overflow:scroll;'} , [
                `${preState(['searchTab2','children'],[])[id].name}`
            ])
        ]
    )
}