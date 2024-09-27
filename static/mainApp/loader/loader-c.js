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

const mapped = new Map(
    [
        ['name','favour'],
        ['name','daniel'],
        ['name','debbie'],
        ['name','fav'],
]
)

setStyle([
    {
        nameTag:'loader_style',
        style:{
            height:'100%',
            width:'100%',
            position:'absolute',
            top:'0',
            left:'0',
            // zIndex:'1500',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }
    }
])

sydDOM.loader = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.loader_style()
        },
        [
            createElement(
                'div',
                {
                    style:'height:50px;width:50px;background:#fff;border-radius:50%',
                    class:'loader ecommerce_page_loader'
                },
                [
                    createElement('div',{class:'loader_elem1'}),
                    createElement('div',{class:'loader_elem2'}),
                ]
            )
        ]
    )
}