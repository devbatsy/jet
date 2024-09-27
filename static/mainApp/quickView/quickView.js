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
    quickViewImgScale_over = () =>{
        const state = getState('quickView');
        state.imgSize = '250%';
        state.imgPos = '0% 0%'
        useState('quickView' , {type:'a' , value:state})
    }
    quickViewImgScale_out = () =>{
        const state = getState('quickView');
        state.imgSize = 'contain';
        state.imgPos = 'center'
        useState('quickView' , {type:'a' , value:state})
    }
    quickViewImgScale_touchStart = () =>{
        console.log('came here')
        const state = getState('quickView');
        state.imgSize = '250%';
        state.imgPos = '0% 0%'
        useState('quickView' , {type:'a' , value:state})
    }
    quickViewImgScale_touchEnd = () =>{
        const state = getState('quickView');
        state.imgSize = 'contain';
        state.imgPos = 'center'
        useState('quickView' , {type:'a' , value:state})
    }

    const img = preState(['mainDisplayPanel','children'],[])[preState(['quickView','current'],0)] === undefined ? '' : preState(['mainDisplayPanel','children'],[])[preState(['quickView','current'],0)].productImg;

    const renderDeviceInfo = () =>{
        const device = preState(['mainDisplayPanel','children'],[])[preState(['quickView','current'],0)]
        const array = [];
        if(device)
        {
            for(let i = 0; i < Object.keys(device).length; i++)
            {
                if(`${device[Object.keys(device)[i]]}`.length > 0 && Object.keys(device)[i] !== 'id' && Object.keys(device)[i] !== 'productImg' && Object.keys(device)[i] !== 'count')
                {

                    array.push(
                        createElement(
                            'li',
                            {
                                style:'display:flex;column-gap:10px;padding:5px;list-style-type:disc;'
                            },[
                                createElement('p', {style:'font-size:12px;font-weight:700;text-transform:capitalize;'},[`${Object.keys(device)[i]}`]),
                                createElement('p' , {style:"font-size:12px;font-weight:500;"} , [`${device[Object.keys(device)[i]]}`])
                            ]
                        )
                    )   
                }
            }
        }

        return array;
    }

    return createElement(
        'div',
        {
            style:`height:100%;width:100%;background:rgba(0,0,0,.7);position:fixed;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);z-index:1200;display:${preState(['quickView','d'],'none')};justify-content:center;align-items:center;`
        },
        [
            createElement(
                'div',
                {
                    style:'min-height:350px;max-height:1000px;height:80%;width:100%;max-width:1000px;min-width:300px;background:#fff;display:flex;justify-content:center;align-items:center;row-gap:10px;column-gap:10px;flex-wrap:wrap;padding:10px 5px;overflow:scroll;position:relative',
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
                        'div',//${webUrl}/image?icon=${extractImageId(extract(preState(['quickView','current'],0),'id').split('').reverse().join(''))}
                        {
                            style:`cursor: zoom-in;height:100%;min-height:300px;width:50%;min-width:270px;background-image:url('${img}');transition:background-size linear .3s;`+styleComponent.bg(
                                {
                                    method:'add',
                                    style:{
                                        backgroundSize:preState(['quickView','imgSize'],'contain'),
                                        backgroundPosition:preState(['quickView','imgPos'],'center'),
                                    }
                                }
                            ),//;background-image:url("http://localhost:9090/image?icons=chat")
                            onmouseover:'quickViewImgScale_over()',
                            onmouseout:'quickViewImgScale_out()',
                            ontouchstart:'quickViewImgScale_touchStart()',
                            ontouchend:'quickViewImgScale_touchEnd()',
                            class:'thinBorder'
                        },[],{type:'img_quickView'}
                    ),
                    createElement(
                        'div',
                        {
                            style:sydDOM.mainPanelChild_capsule({index:''}).inherit(['children'])[2].inherit(['attribute','style']) + 'height:100%;min-height:200px;width:30%;min-width:200px;max-height:300px;overflow-y:scroll;justify-content:space-around;padding:10px;row-gap:10px;',
                            class:'thinBorder'
                        },
                        [
                            createElement(
                                'div',
                                {
                                    style:'display:flex;flex-direction:column;row-gap:10px;align-items:center;width:100%'
                                },
                                [
                                    sydDOM.mainPanelText_names_header({index:preState(['quickView','current'],-1),param:'name'}),
                                    sydDOM.mainPanelText_price({index:preState(['quickView','current'],-1),param:'price'}),
                                    createElement('hr',{style:'width:100%'}), 
                                    createElement(
                                        'div',
                                        {
                                            style:'padding:10px 0px;overflow-y:scroll;display:flex;row-gap:10px;width:100%;height:100px;background:#cccccc;display:flex;flex-direction:column;row-gap:10px;padding:10px;'
                                        },[
                                            createElement('p' , {style:'font-size:14px;font-weight:700;margin-bottom:5px;text-transform:uppercase;'},['Device Info']),
                                            ...renderDeviceInfo()
                                        ]
                                    )     
                                ]
                            ),
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
                state:{d:'none',current:-1 , imgSize:'contain' , imgPos:'center'}
            },
            type:'quickView'
        }
    )
}

window.addEventListener('load' , e =>{
    virtualDom['img_quickView'].addEventListener('mousemove' , e =>{
        const Xposition = e.offsetX;
        const width = virtualDom['img_quickView'].getBoundingClientRect().width;
        const Yposition = e.offsetY;
        const height = virtualDom['img_quickView'].getBoundingClientRect().height;

        // console.log(`x% : ${Xposition / width} %   y% : ${Yposition / height}`)

        const state = getState('quickView');
        state.imgPos = `${100 * (Xposition / width)}%  ${100 * (Yposition / height)}%`;
        useState('quickView' , {type:'a' , value:state})
    })

    virtualDom['img_quickView'].addEventListener('touchmove' , e =>{
        e.preventDefault()
        const Xposition = e.touches[0].clientX;
        const width = virtualDom['img_quickView'].getBoundingClientRect().width;
        const Yposition = e.touches[0].clientY;
        const height = virtualDom['img_quickView'].getBoundingClientRect().height;

        // console.log(`x% : ${Xposition / width} %   y% : ${Yposition / height}`)

        const state = getState('quickView');
        state.imgPos = `${100 * (Xposition / width)}%  ${100 * (Yposition / height)}%`;
        useState('quickView' , {type:'a' , value:state})
    })
})

// setTimeout(() => {
//     console.log(sydDOM.mainPanelChild_capsule({index:100}).inherit(['children']))
// }, 1000);