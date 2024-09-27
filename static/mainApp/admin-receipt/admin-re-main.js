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

import '../navComponentNonSticky.js'
import '../navComponentSticky.js'
import '../bodyContent/bodyContent.js'
import '../newsletter/newsletter.js'
import '../contactInfoPage/contactInfoPage.js'
import '../quickView/quickView.js'
import './admin-socket.js'
// import './check-out-body.js';
// import '../loader/loader-c.js'

setStyle([
    {
        nameTag:'container',
        style:{
            height:'100vh',
            width:'100vw',
            display:'flex',
            flexDirection:'column',
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
    },
    {
        nameTag:'mainBodyContent',
        style:{
            // minHeight:'100%',
            width:'100%',
            background:'inherit',
            rowGap:'20px',
            padding:'10px',
            position:'relative',
            height:'fit-content',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
            // background:'green'
        }
    },
    {
        nameTag:'body_reciept',
        style:{
            rowGap:'20px',
            padding:'10px',
            position:'relative',
            height:'fit-content',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            width:'100%',
            flexDirection:'column',
            // background:'green',
            paddingTop:'30px'
            // maxHeight:'500px'
        }
    }
])

extract = (index,param) =>{
    const parent = preState(['mainDisplayPanel','children'],[])[index];
    let text = ''
    switch(true)
    {
        case parent !== undefined:
            text = parent[param]
    }
    return text
}

getcartInfo = (index,param) =>{
    const data = preState(['floatBodyContent_cart1','cartInfo'],[])[index];
    let text = '';
    switch(true)
    {
        case data !== undefined:
            text = data[param]
    }
    return `${text}`
}

getInvoiceInfo = (index,param) =>{
    const data = preState(['paymentInfo','invoice'],[])[index];
    let text = '';
    switch(true)
    {
        case data !== undefined:
            text = data[param]
            switch(param)
            {
                case 'price':
                    text = `${Number(text) * Number(data.count)}`;
                break;
                case 'name':
                    text = `${text} (${data.count})`
            }
    }
    return `${text}`
}

getTotalCart_elem = () =>{
    const floatBodyContent_cart1_el = preState(['floatBodyContent_cart1','cartInfo'],[]);
    let subTotal = 0
    for(let i = 0; i < floatBodyContent_cart1_el.length; i++)
    {
        subTotal += floatBodyContent_cart1_el[i].price * Number(floatBodyContent_cart1_el[i].count);
    }
    return subTotal
}

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.container({method:'add',style:{overflowY:preState(['container','ov'],'scroll')}})
        },
        [
            sydDOM.topNonStickyContactNav(),
            sydDOM.topStickyNav(),
            sydDOM.receipts(),
            sydDOM.newsLetter(),
            sydDOM.contactInfoPage(),
            sydDOM.decForm(),
            sydDOM.contactMessage(),
        ],
        {
            createState:{
                stateName:'container',
                state:{colors:{
                    shadow:'grey'
                },ov:'scroll' , jetBrands:['hp' , 'dell' , 'lenovo' , 'acer' , 'apple']}
            },
            type:'container'
        }
    )
}

sydDOM.receipt_elem = (name = 'nworah favour',link) =>{
    return createElement(
        'li',
        {
            style:'display:flex;column-gap:50px;width:100%;max-width:900px;font-size:14px;justify-content:space-between;padding:5px;align-items:center',
            class:'thinBorder'
        },
        [
            createElement('strong',{style:'text-transform:uppercase'},[name]),
            createElement('a',{target:'blank',href:link,style:'background:lightgrey;border-radius:3px;padding:3px;text-transform:lowercase;font-size:12px;font-weight:500;color:#2b5e6eb8'},['view reciept'])
        ]
    )
}

sydDOM.receipts = () =>{
    const getEl = () =>{
        let elements = [];

        preState(['receipts','data'],[]).forEach(val =>{
            console.log(val.name,val.link)
            elements.push(
                sydDOM.receipt_elem(`${val.name}`,`${val.link}`)
            )
        })
        elements = elements.length === 0 ? [createElement('h1',{style:'text-transform:capitalize'},['no reciepts found'])] : elements

        console.log(preState(['receipts','data'],[]))

        return elements;
    }
    return createElement(
        'div',
        {
            style:styleComponent.body_reciept()
        },
        [
            ...getEl()
        ],
        {
            createState:{
                stateName:'receipts',
                state:{data:[]}
            },
            type:'receipts'
        }
    )
}

sydDOM.contactMessage = () =>{
    togContactTabs = () =>{
        const contactMessage = getState('contactMessage');
        
        contactMessage.current = contactMessage.current === 0 ? 1 : 0

        useState('contactMessage', {type:"a",value:contactMessage})
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;width:200px;position:sticky;right:20px;bottom:70px;display:flex;justify-content:center;column-gap:8px;align-items:center;padding:0 10px;z-index:900;align-self:flex-end',
            class:'contactMessage'
        },
        [
            createElement(
                'div',
                {
                    style:'height:fit-content;position:relative;width:100%;',
                },
                [
                    sydDOM.contactText(),
                    sydDOM.contactIcons()
                ]
            ),
            createElement('div',{style:`transition:all .3s linear;transform:rotateZ(${preState(['contactMessage','current'],0) * -360}deg);height:50px;width:50px;min-height:50px;min-width:50px;border-radius:50%;background:#000;cursor:pointer;z-index:100;`+styleComponent.bg({method:'add',style:{backgroundImage:preState(['contactMessage','current'],0) === 0 ? `url(${webUrl}/image?icon=chat)` : `url(${webUrl}/image?icon=exit)`,backgroundSize:'80%'}}),onclick:'togContactTabs()'})
        ],{
            createState:{
                stateName:'contactMessage',
                state:{current:0}
            },
            type:'contactMessage'
        }
    )
}

// sydDOM.displayRedirectMsg = () =>{
//     return createElement(
//         'div',
//         {
//             style:styleComponent.mainBodyContent()
//         },
//         [
//             sydDOM.reciept()
//         ]
//     )
// }

// sydDOM.reciept = () =>{
//     const processProductInfo = () =>{
//         let data2 = productsInfo.split('|');
//         const elements = new Array()
//         data2.forEach((val,id) =>{
//             let data3 = val.split('--');
//             let renderedData = {}
//             renderedData.name = `${data3[0]} (${data3[2]}unit(s))`;
//             renderedData.cummPrice = `${Number(data3[1]) * Number(data3[2])}`;
//             elements.push(
//                 sydDOM.renderRecieptMiniInfo_product(renderedData)
//             )
//             // console.log(renderedData)
//         })
//     return elements
//     }
    
//     return createElement(
//         'div',
//         {
//             style:'height:fit-content;width:100%;max-width:300px;min-height:300px;background:#ecebeb;border-radius:10px;border:5px groove;border-top:2px groove;border-right:2px groove;border:none;display:flex;flex-direction:column;row-gap:20px;box-shadow:1px 1px 3px #000;padding:10px'
//         },
//         [
//             createElement(
//                 'h2',
//                 {
//                     style:'text-transform:capitalize;text-align:center;font-weight:500;text-decoration:underline;width:100%'
//                 },
//                 [
//                     'e-reciept'
//                 ]
//             ),
//             sydDOM.renderRecieptMiniInfo(['Transaction Id',txId]),
//             createElement(
//                 'p',
//                 {
//                     style:'font-weight:500;font-size:14px;text-transform:capitalize;',
//                 },
//                 [
//                     'e-reciept: ',createElement('a',{style:'background:lightgrey;border-radius:3px;padding:3px;text-transform:lowercase;font-size:12px;font-weight:500;color:#2b5e6eb8',href:location.href},['view reciept']),
//                 ]
//             ),
//             sydDOM.renderRecieptMiniInfo(['Customer Name',customerInfo.toUpperCase()]),
//             sydDOM.renderRecieptMiniInfo(['Purchased Items','']),
//             ...processProductInfo(),
//             createElement(
//                 'p',
//                 {
//                     style:'font-weight:500;font-size:14px;text-transform:capitalize;',
//                 },
//                 [
//                     'transaction status: ',createElement('strong',{style:`font-family:monospace;color:${redirectMsg === 'success' ? '#02f502' : '#ff4136'}`},[redirectMsg]),
//                     createElement('i',{
//                         class:redirectMsg === 'success' ? "fa-solid fa-square-check" :"fa-solid fa-circle-exclamation",
//                         style:`margin-left:5px;color:${redirectMsg === 'success' ? '#02f502' : '#ff4136'}`})
//                 ]
//             )
//         ]
//     )
// }

// sydDOM.renderRecieptMiniInfo = (item) =>{
//     return createElement(
//         'p',
//         {
//             style:'font-weight:500;font-size:14px',
//         },
//         [
//             `${item[0]}: `,item[1].length > 0 ? createElement('strong',{style:'background:lightgrey;border-radius:3px;padding:3px;font-size:12px;cursor:pointer;font-family:monospace'},[item[1]]) : '',
//         ]
//     )
// }

// sydDOM.renderRecieptMiniInfo_product = (item) =>{
//     return createElement(
//         'p',
//         {
//             style:'margin-left:10px;font-weight:500;font-size:11px;display:flex;column-gap:20px;justify-content:space-between',
//         },
//         [
//             `${item.name}: `,createElement('strong',{style:'border-radius:3px;padding:3px;cursor:pointer;font-family:monospace;font-size:12px'},[item.cummPrice]),
//         ]
//     )
// }

sydDOM.contactText = () =>{
    return createElement(
        'p',
        {
            style:`font-weight:700;text-transform:capitalize;background:#fff;box-shadow:0 0 5px #333;border-radius:10px;cursor:pointer;display:${preState(['contactMessage','current'],0) === 0 ? 'flex' : 'none'}`,
            class:'animateEntrance_opacity spook'
        },
        [createElement('p',{style:'padding:10px;height:100%;width:100%;background:#fff;border-radius:inherit;z-index:200'},['contact us'])],
        {
            createState:{
                stateName:'contactText',
                state:{d:'block'}
            },
            type:'contactText'
        }
    )
}

sydDOM.contactIcons = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;background:unset;position:absolute;top:50%;z-index:100;'+styleComponent.flexType({method:'add',style:{justifyContent:'center',columnGap:'5px',display:`${preState(['contactMessage','current'],0) === 1 ? 'flex' : 'none'}`}}),
            class:'animateEntrance'
        },
        [
            createElement('div',{style:styleComponent.menuBox({method:'add',style:{height:'40px',width:'40px',animationDuration:'.8s'}}) + styleComponent.bg({method:'add',style:{backgroundImage:`url(${webUrl}/image?icon=phone)`}}),class:'mainPanelXEntrance'}),
            createElement('div',{style:styleComponent.menuBox({method:'add',style:{height:'40px',width:'40px'}})  + styleComponent.bg({method:'add',style:{backgroundImage:`url(${webUrl}/image?icon=whatsapp)`}}),class:''}),
        ]
    )
}

sydDOM.decForm = () =>{
    return createElement(
        'form',
        {
            style:'position:absolute;top:-300px;pointer-events: none;height:0;width:0;cursor:pointer',
            action:`${preState(['decForm','req'],'')}`,
            method:"POST"
        },
        [
            createElement('input',{name:'cartInfo',value:preState(['decForm','cartInfo'],'0000 ? 0000')}),
            createElement('input',{name:'webMode',value:preState(['decForm','webMode'],'')})
        ],
        {
            createState:{
                stateName:'decForm',
                state:{req:'',cartInfo:'0000 ? 0000',webMode:''}
            },
            type:'decForm'
        }
    )
}


mount(sydDOM.container())

addEventListener('resize', e =>{
    setMediaQuery750();
    setMediaQuery1200();
   
})
addEventListener('load', () =>{
    setMediaQuery750();
    setMediaQuery1200();
})
function setMediaQuery750(){
    const searchTab1 = getState('searchTab1');
    const menuBtn1 = getState('menuBtn1');
    const likeHeart1 = getState('likeHeart1');
    const wrapAcc_cart = getState('wrapAcc_cart');
    const mobileMenuSearch = getState('mobileMenuSearch');
    const floatBodyContent = getState('floatBodyContent');
    const topStickyNav = getState('topStickyNav');
    switch(true)
    {
        case Number(window.innerWidth) <= 750:
            searchTab1.d = 'none';
            menuBtn1.d = 'none';
            likeHeart1.d = 'none';
            wrapAcc_cart.f = 'unset';
            mobileMenuSearch.d = 'flex';
            topStickyNav.jC = 'space-around';
        break;
        default:
            floatBodyContent.d = 'none';
            floatBodyContent.o = '0';
            floatBodyContent.controller = ''
            searchTab1.d = 'flex'
            menuBtn1.d = 'flex'
            likeHeart1.d = 'flex'
            wrapAcc_cart.f = '2 / 5'
            mobileMenuSearch.d = 'none';
            topStickyNav.jC = 'space-between'
    }
    useState('searchTab1', {type:'a', value:searchTab1})
    useState('menuBtn1', {type:'a', value:menuBtn1})
    useState('likeHeart1', {type:'a', value:likeHeart1})
    useState('wrapAcc_cart', {type:'a',value:wrapAcc_cart})
    useState('mobileMenuSearch',{type:'a',value:mobileMenuSearch});
    useState('topStickyNav', {type:'a',value:topStickyNav})
}

function setMediaQuery1200()
{
    const menuBtn1 = getState('menuBtn1');
    const extraLargeTabMenu = getState('extraLargeTabMenu');
    switch(true)
    {
        case Number(window.innerWidth) >= 1200:
            menuBtn1.d = 'none';
            extraLargeTabMenu.d = 'flex';
        break;
        default:
            extraLargeTabMenu.d = 'none'
    }
    useState('menuBtn1', {type:'a', value:menuBtn1})
    useState('extraLargeTabMenu',{type:'a',value:extraLargeTabMenu})
}

virtualDom['container'].addEventListener('scroll', e =>{
    const topStickyNav = getState('topStickyNav')
    switch(true)
    {
        case Number(e.target.scrollTop) >= 42:
            topStickyNav.sh = preState(['container','colors','shadow'],'')
        break;
        default:
            topStickyNav.sh = 'transparent'
    }
    useState('topStickyNav', {type:'a',value:topStickyNav})
})