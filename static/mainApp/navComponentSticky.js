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
} from '../../sydneyLib/sydneyDom.js'

setStyle([
    {
        nameTag:'topStickyNav',
        style:{
            width:'100%',
            paddingTop:'15px',
            paddingBottom:'15px',
            columnGap:'20px',
            position:'sticky',
            top:'0px',
            background:'inherit',
            zIndex:'1000'
        }
    },
    {
        nameTag:'menuBox',
        style:{
            minHeight:'25px',
            minWidth:'25px',
            justifyContent:'center',
            alignItems:'center',
            display:'flex',
            cursor:'pointer',
            fontSize:'18px',
        }
    },
    {
        nameTag:'stickyNavWrap',
        style:{
            // padding:'5px',
            display:'flex',
            columnGap:'20px',
            justifyContent:'space-between'
        }
    }
])

sydDOM.topStickyNav = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.topStickyNav() + styleComponent.flexType(
                [
                    {method:'add',style:{justifyContent:preState(['topStickyNav','jC'],'space-between'),boxShadow:`0px 2px 5px ${preState(['topStickyNav','sh'],'transparent')}`}}
                ]
            ),
            id:'topStickyNav',
            class:'direct-child'
        },
        [
            sydDOM.mobileMenuSearch(),
            sydDOM.logoIcon(),
            sydDOM.extraLargeTabMenu(),
            sydDOM.searchTab1(),
            sydDOM.menuBtn1(),
            sydDOM.likeHeart1(),
            sydDOM.wrapAcc_cart(),
            sydDOM.MenuBelowNav(),
            sydDOM.floatBodyContent(),
            
        ],
        {
            createState:{
                stateName:'topStickyNav',
                state:{jC:'space-between',sh:'transparent'}
            },
            type:'topStickyNav'
        }
    )
}

sydDOM.wrapAcc_cart = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.stickyNavWrap() + `position:relative;flex:calc(${preState(['wrapAcc_cart','f'],'2 / 5')});`
        },
        [
            sydDOM.acccount(),
            sydDOM.cart1(),
            sydDOM.createAccountPage()
        ],
        {
            createState:{
                stateName:'wrapAcc_cart',
                state:{f:'2 / 5'}
            },
            type:'wrapAcc_cart'
        }
    )
}

sydDOM.MenuBelowNav = () =>{
    return createElement(
        'div',
        {
            style:`display:${preState(['MenuBelowNav','d'],'none')};opacity:${preState(['MenuBelowNav','o'],'0')};height:50px;width:100%;background:#fff;position:absolute;bottom:0;left:0;transform:translateY(${preState(['MenuBelowNav','o'],'0') === '1' ? '100' : '90'}%);transition:all linear .2s;box-shadow:0px 2px 5px ${preState(['topStickyNav','sh'],'transparent')}`,
            class:'thinBorder'
        },
        [
            createElement(
                'ul',
                {
                    style:'display:flex;align-items:center;height:100%;width:100%;max-width:600px;text-transform:capitalize;column-gap:10px'
                },
                [
                    sydDOM.createMainMenuLinkBtn({content:'hp'}),
                    sydDOM.createMainMenuLinkBtn({content:'dell'}),
                    sydDOM.createMainMenuLinkBtn({content:'acer'}),
                    sydDOM.createMainMenuLinkBtn({content:'apple'}),
                    sydDOM.createMainMenuLinkBtn({content:'lenovo'})
                ]
            )
        ],
        {
            createState:{
                stateName:'MenuBelowNav',
                state:{d:'none',o:'0'}
            },
            type:'MenuBelowNav'
        }
    )
}

sydDOM.logoIcon = () =>{
    return createElement(
        'div',
        {
            style:'height:100%;width:28%;',
            class:'thinBorder'
        }
    )
}

sydDOM.searchTab1 = () =>{
    return createElement(
        'div',
        {
            style:`height:50%;width:40%;min-height:40px;display:${preState(['searchTab1','d'],'none')};align-items:center;padding:5px`
        },
        [
            createElement(
                'div',
                {
                    style:'height:100%;width:100%;min-height:35px;position:relative'
                },
                [
                    sydDOM.searchTab1Input(),
                    sydDOM.searchTab1Button()
                ]
            )
        ],
        {
            createState:{
                stateName:'searchTab1',
                state:{d:'none'}
            },
            type:'searchTab1'
        }
    )
}

sydDOM.searchTab1Input = () =>{
    return createElement(
        'input',
        {
            style:'height:100%;width:100%;background:lightgrey;padding-left:20px;padding-right:60px;',
            placeholder:'search for products'
        }
    )
}

sydDOM.searchTab1Button = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.menuBox() + 'position:absolute;top:50%;right:10px;transform:translateY(-50%)'
        },
        [
            createElement('i',{class:"fa-solid fa-magnifying-glass"})
        ]
    )
}

sydDOM.menuBtn1 = () =>{
    togMenuBelowNav = () =>{
        const MenuBelowNav = getState('MenuBelowNav');
        const menuBtn1 = getState('menuBtn1')
        switch(MenuBelowNav.d)
        {
            case 'none':
                MenuBelowNav.d = 'flex';
                const timer = setTimeout(() => {
                    const MenuBelowNav = getState('MenuBelowNav');
                    MenuBelowNav.o = '1';
                    useState('MenuBelowNav',{type:'a',value:MenuBelowNav})
                    clearTimeout(timer)
                }, 100);
                menuBtn1.content = 1;
            break;
            default:
                MenuBelowNav.d = 'none';
                MenuBelowNav.o = '0';
                menuBtn1.content = 0
        }
        useState('MenuBelowNav',{type:'a',value:MenuBelowNav});
        console.log(getState('menuBtn1'))
        useState('menuBtn1',{type:'a',value:menuBtn1})
    }
    return createElement(
        'div',
        {
            style:styleComponent.menuBox() + `display:${preState(['menuBtn1','d'],'none')};`,
            onclick:'togMenuBelowNav()'
        },
        [
            createElement('i',{class:preState(['menuBtn1','content'],0) === 1 ? "fa-solid fa-xmark" : "fa-solid fa-bars"})
        ],
        {
            createState:{
                stateName:'menuBtn1',
                state:{d:'none',content:0}
            },
            type:'menuBtn1'
        }
    )
}

sydDOM.acccount = () =>{
    goToLogin = () =>{
        console.log('clicking on this')
    }
    togMiniLogin = () =>{
        const createAccountPage = getState('createAccountPage')
        createAccountPage.d = 'flex';
        useState('createAccountPage', {type:'a',value:createAccountPage})
        const timer = setTimeout(() => {
            const createAccountPage = getState('createAccountPage');
            createAccountPage.o = '1';
            useState('createAccountPage',{type:'a',value:createAccountPage})

            clearTimeout(timer)
        }, 100);
        virtualDom['createAccountPage'].focus()
    }
    return createElement(
        'div',
        {
            style:styleComponent.menuBox(),
            onclick:'goToLogin()',
            onmouseover:'togMiniLogin()'
        },
        [
            createElement('i',{class:'fa-solid fa-user'})
        ]
    )
}

sydDOM.likeHeart1 = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.menuBox() + `display:${preState(['likeHeart1','d'],'none')}`
        },
        [
            createElement('i',{class:'fa-regular fa-heart'})
        ],
        {
            createState:{
                stateName:'likeHeart1',
                state:{d:'none'}
            },
            type:'likeHeart1'
        }
    )
}

sydDOM.cart1 = () =>{
    const type = 'cart1'
    return createElement(
        'div',
        {
            style:styleComponent.menuBox() + 'position:relative',
            onclick:'togFloatBody("cart1")'
        },
        [
            createElement('i',{class:preState(['floatBodyContent','controller'],'') !== type ? "fa-solid fa-cart-shopping" : "fa-solid fa-xmark"}),
            createElement('span',{style:'min-height:15px;min-width:15px;border-radius:50%;background:#171717;color:#fff;font-weight:700;text-align:center;position:absolute;left:2px;top:2px;font-size:12px;display:flex;justify-content:center;align-items:center;font-family:"Plus Jakarta Sans", sans-serif;transform:translateY(-50%) translateX(-50%)'},[`${preState(['cart1','cartItems'],0)}` === '0' ? '' : `${preState(['cart1','cartItems'],0)}`])
        ],
        {
            createState:{
                stateName:'cart1',
                state:{cartItems:0}
            },
            type:'cart1'
        }
    )
}

sydDOM.mobileMenuSearch = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.stickyNavWrap() + `display:${preState(['mobileMenuSearch','d'],'none')};`
        },
        [
            sydDOM.Mmenu(),
            sydDOM.Msearch()
        ],
        {
            createState:{
                stateName:'mobileMenuSearch',
                state:{d:'none'}
            },
            type:'mobileMenuSearch'
        }
    )
}

sydDOM.Msearch = () =>{
    const type = 'Msearch'
    return createElement(
        'div',
        {
            style:styleComponent.menuBox(),
            onclick:'togFloatBody("Msearch")'
        },
        [
            createElement('i',{class:preState(['floatBodyContent','controller'],'') !== type ? "fa-solid fa-magnifying-glass" : "fa-solid fa-xmark"})
        ]
    )
}

sydDOM.Mmenu = () =>{
    const type = 'Mmenu'
    return createElement(
        'div',
        {
            style:styleComponent.menuBox(),
            onclick:`togFloatBody("${type}")`
        },
        [
            createElement('i',{class:preState(['floatBodyContent','controller'],'') !== type ? "fa-solid fa-bars" : "fa-solid fa-xmark"})
        ]
    )
}

sydDOM.extraLargeTabMenu = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;min-width:350px;width:50%;display:${preState(['extraLargeTabMenu','d'],'none')};`,
            class:'thinBorder'
        },
        [
            createElement(
                'ul',
                {
                    style:'display:flex;align-items:center;height:100%;width:100%;text-transform:capitalize;column-gap:10px;flex-wrap:wrap;padding:0 10px;'
                },
                [
                    sydDOM.createMainMenuLinkBtn({content:'hp'}),
                    sydDOM.createMainMenuLinkBtn({content:'dell'}),
                    sydDOM.createMainMenuLinkBtn({content:'acer'}),
                    sydDOM.createMainMenuLinkBtn({content:'apple'}),
                    sydDOM.createMainMenuLinkBtn({content:'lenovo'})
                ]
            )
        ],
        {
            createState:{
                stateName:'extraLargeTabMenu',
                state:{d:'none'}
            },
            type:'extraLargeTabMenu'
        }
    )
}

sydDOM.createMainMenuLinkBtn = ({content}) =>{
    animateLinkText = (elem,content) =>{
        switch(content !== category)
        {
            case true:
                elem.children[0].style.width = '100%'
        }
    }
    de_animateLinkText = (elem,content) =>{
        switch(content !== category)
        {
            case true:
                elem.children[0].style.width = '0%'
        }
    }
    loadDecForm = (content,link) =>{
        const decForm = getState('decForm');
        const floatBodyContent_cart1 = getState('floatBodyContent_cart1');
        const array = []
        for(let i = 0; i < floatBodyContent_cart1.cartInfo.length; i++)
        {
            const product_trans_Cart = `${floatBodyContent_cart1.cartInfo[i].id}[${floatBodyContent_cart1.cartInfo[i].count}]`

            array.push(product_trans_Cart)
        }
        decForm.req = link === undefined ? `/?type=${content}` : `/${link}`;
        decForm.webMode = content;
        decForm.cartInfo = array.join('|')
        useState('decForm',{type:'a',value:decForm})
        virtualDom['decForm'].submit()
    }
    return createElement(
        'p',
        {
            style:'padding:10px 20px;position:relative',
            class:'click',
            onmouseover:`animateLinkText(this,'${content}')`,
            onmouseout:`de_animateLinkText(this,'${content}')`,
            onclick:`loadDecForm('${content}')`
            // href:webType + content
        },
        [
            content,
            createElement('span',{style:`position:absolute;top:calc(100%);left:50%;transform:translateX(-50%);height:1px;width:${category === content ? '100%' : '0%'};background:#171717;transition:all ease-in .2s;`})
        ]
    )
}

sydDOM.createAccountPage = () =>{
    closeMiniAccPage = () =>{
        const createAccountPage = getState('createAccountPage')
        createAccountPage.d = 'none';
        createAccountPage.o = '0'
        useState('createAccountPage', {type:'a',value:createAccountPage})
    }
    return createElement(
        'div',
        {
            style:`position:absolute;top:calc(100% + 0px);right:50%;height:${preState(['createAccountPage','o'],'0') === '1' ? '320px' : '200px'};width:400px;z-index:999;display:${preState(['createAccountPage','d'],'none')};opacity:${preState(['createAccountPage','o'],'0')};transition:height .7s cubic-bezier(0, 0, 0, 1.42),opacity .3s linear;background:#fff;`,
            tabindex:'0',
            onmouseout:'closeMiniAccPage()',
            onblur:'closeMiniAccPage()',
            class:'thinBorder'
        },
        [
            ``
        ],
        {
            createState:{
                stateName:'createAccountPage',
                state:{d:'none',o:'0'}
            },
            type:'createAccountPage'
        }
    )
}