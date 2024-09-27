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

setStyle([
    {
        nameTag:'contactPageChild_style',
        style:{
            height:'fit-content',
            width:'fit-content',
            minWidth:'100px',
            display:'flex',
            flexDirection:'column',
            rowGap:'20px',
            padding:'5px',
            fontSize:'14px',
        }
    }
])

sydDOM.contactInfoPage = () =>{
    const renderMenu = () =>{
        const elements = preState(['container' , 'jetBrands'],['hp' , 'dell' , 'lenovo' , 'acer' , 'apple']);
        const array = [];
        elements.forEach(val =>{
            array.push(
                sydDOM.createLinkBtn({content:`${val}`,type:'shop'})
            )
        })
        
        return array;
    }
    return createElement(
        'div',
        {
            style:'display:flex;flex-wrap:wrap;justify-content:flex-start;padding:30px 50px;width:100%;height:fit-content;column-gap:30px;row-gap:30px;background:#fff'
        },
        [
            createElement(
                'div',
                {
                    style:styleComponent.contactPageChild_style({method:'add',style:{alignItems:'center'}})
                },
                [
                    createElement(
                        'div',
                        {
                            style:'height:100px;width:100px',
                            class:'thinBorder'
                        }
                    ),
                    sydDOM.createLinkBtn({content:'----address----',link:false}),
                    sydDOM.createLinkBtn({content:'----phone----',link:false}),
                ]
            ),
            createElement(
                'div',
                {
                    style:styleComponent.contactPageChild_style({method:'add',style:{alignItems:'flex-start',width:'fit-content',minWidth:'unset'}}) + 'flex-wrap:wrap;height:250px;column-gap:50px;'
                },
                [
                    ...renderMenu()
                    // sydDOM.mainPanelText_names_header({content:'Shop'}),
                    // sydDOM.createLinkBtn({content:'hp',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'dell',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'acer',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'apple',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'lenovo',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'hp',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'dell',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'acer',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'apple',type:'shop'}),
                    // sydDOM.createLinkBtn({content:'lenovo',type:'shop'}),
                ]
            ),
            createElement(
                'div',
                {
                    style:styleComponent.contactPageChild_style({method:'add',style:{alignItems:'flex-start'}})
                },
                [
                    sydDOM.mainPanelText_names_header({content:'Information'}),
                    sydDOM.createLinkBtn({content:'shopping info'}),
                    sydDOM.createLinkBtn({content:'privacy-policy'}),
                    sydDOM.createLinkBtn({content:'about-us'}),
                ]
            )
        ]
    )
}

sydDOM.createLinkBtn = ({content,link = true,type = ''}) =>{
    const linkAttr = () =>{
        return link ? {onclick:type === 'shop' ? `loadDecForm("${content}")` : ``} : {}
    }
    return createElement(
        link === true ? 'a' : 'p',
        {
            style:sydDOM.mainPanelText_names().inherit(['attribute','style']) + ';display:block;cursor:pointer;color:#000;text-transform:capitalize',
            ...linkAttr()
        },
        [
            content
        ]
    )
}
