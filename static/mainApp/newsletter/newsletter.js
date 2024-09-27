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
        nameTag:'newsLetter',
        style:{
            height:'fit-content',
            width:'100%',
            display:'flex',
            rowGap:'20px',
            flexDirection:'column',
            alignItems:'center',
            padding:'50px 20px',
            border:'1px solid grey',
            background:'#fff'
        }
    },
    {
        nameTag:'headerText',
        style:{
            fontSize:'20px',
            fontWeight:'500',
            textTransform:'capitalize'
        }
    }
])

sydDOM.newsLetter = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.newsLetter()
        },
        [
            createElement(
                'p',
                {
                    style:styleComponent.headerText() + 'width:100%;padding:10px 0;text-align:center'
                },
                [
                    'Join our newsletter'
                ]
            ),
            createElement(
                'div',
                {
                    style:'display:flex;column-gap:10px;padding:10px;max-width:600px;justify-content:center;height:70px;width:100%'
                },
                [
                    createElement(
                        'input',
                        {
                            style:sydDOM.searchTab1Input().inherit(['attribute','style']) + 'height:100%;font-size:18px;padding-right:10px;',
                            placeholder:'Your email here',
                            class:'thinBorder',
                            type:'email'
                        }
                    ),
                    createElement(
                        'div',
                        {
                            style:'height:100%;display:flex;justify-content:center;align-items:center;padding:0 20px;font-weight:500;color:#fff;background:#702670;text-transform:capitalize',
                            class:'click'
                        },
                        [
                            'subscribe'
                        ]
                    )
                ]
            )
        ]
    )
}