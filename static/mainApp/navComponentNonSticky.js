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
        nameTag:'navStyleNonSticky',
        style:{
            height:'fit-content',
            paddingTop:'7px ',
            paddingBottom:'7px ',
            width:'100%',
            flexDirection:'row',
            background:'#fff'
        }
    },
    {
        nameTag:'smallNavtext',
        style:{
            color:'#171717',
            fontSize:'14px',
            textTransform:'capitalize'
        }
    },
    {
        nameTag:'smallClickBox',
        style:{
            height:'18px',
            width:'18px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }
    }
])

sydDOM.topNonStickyContactNav = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.navStyleNonSticky() + styleComponent.flexType([{method:'add',style:{justifyContent:'space-between'}},{method:'remove',style:['display']}]),
            id:'topNonStickyContactNav',
            class:'direct-child'
        },
        [
            sydDOM.nonStickyNavchild1(),
            sydDOM.nonStickyNavchild2(),
        ]
    )
}

sydDOM.nonStickyNavchild1 = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;column-gap:30px;padding:5px;' + styleComponent.flexType()
        },
        [
            sydDOM.smallClickBox({content:"fa-brands fa-square-instagram"}),
            sydDOM.smallClickBox({content:"fa-brands fa-facebook"}),
        ]
    )
}

sydDOM.smallClickBox = ({content}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.smallClickBox()
        },
        [
            createElement('i',{class:content})
        ]
    )
}

sydDOM.nonStickyNavchild2 = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;column-gap:30px;padding:5px;' + styleComponent.flexType()
        },
        [
            createElement(
                'p',
                {
                    style:styleComponent.smallNavtext()
                },
                [
                    'about'
                ]
            ),
            createElement(
                'p',
                {
                    style:styleComponent.smallNavtext()
                },
                [
                    'help'
                ]
            ),
            createElement(
                'p',
                {
                    style:styleComponent.smallNavtext()
                },
                [
                    'contact'
                ]
            )
        ]
    )
}