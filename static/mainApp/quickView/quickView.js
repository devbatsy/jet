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


sydDOM.quickView = () =>{
    quickViewBlur = () =>{
        const quickView = getState('quickView');
        quickView.d = 'none';
        useState('quickView',{type:'a',value:quickView})
    }
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;background:rgba(0,0,0,.4);position:fixed;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);z-index:1200;display:${preState(['quickView','d'],'none')};justify-content:center;align-items:center;`
        },
        [
            createElement(
                'div',
                {
                    style:'min-height:350px;max-height:500px;height:fit-content;width:100%;max-width:600px;min-width:300px;background:#fff;display:flex;justify-content:center;align-items:center;row-gap:10px;column-gap:10px;flex-wrap:wrap;padding:10px 5px;overflow:scroll;position:relative',
                    onblur:'quickViewBlur()',
                    tabindex:'0'
                },
                [
                    createElement(
                        'i',
                        {
                            style:styleComponent.menuBox({method:'add',style:{position:'absolute',top:'10px',left:'10px'}}),
                            class:"fa-solid fa-xmark",
                            onclick:'quickViewBlur()'
                        }
                    ),
                    createElement(
                        'div',
                        {
                            style:`height:100%;min-height:300px;width:50%;min-width:270px;background-image:url(${webUrl}/image?icon=${extractImageId(extract(preState(['quickView','current'],0),'id').split('').reverse().join(''))});`+styleComponent.bg(),//;background-image:url("http://localhost:9090/image?icons=chat")
                            class:'thinBorder'
                        }
                    ),
                    createElement(
                        'div',
                        {
                            style:sydDOM.mainPanelChild_capsule({index:''}).inherit(['children'])[2].inherit(['attribute','style']) + 'height:100%;min-height:200px;width:30%;min-width:200px;justify-content:space-around;padding:30px 10px;',
                            class:'thinBorder'
                        },
                        [
                            sydDOM.mainPanelText_names_header({index:preState(['quickView','current'],-1),param:'name'}),
                            sydDOM.mainPanelText_price({index:preState(['quickView','current'],-1),param:'price'}),
                            createElement('hr',{style:'width:100%'}),
                            sydDOM.bottomSelectOption2({index:preState(['quickView','current'],-1)})
                        ]
                    )
                ],
                {
                    type:'quickViewMain'
                }
            )
        ],
        {
            createState:{
                stateName:'quickView',
                state:{d:'none',current:-1}
            },
            type:'quickView'
        }
    )
}

// setTimeout(() => {
//     console.log(sydDOM.mainPanelChild_capsule({index:100}).inherit(['children']))
// }, 1000);