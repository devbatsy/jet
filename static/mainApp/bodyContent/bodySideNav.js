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
        nameTag:'bodySideNav_style',
        style:{
            width:'100%',
            height:'100%',
            background:'rgba(0,0,0,.4)',
            position:'fixed',
            top:'0px',
            display:'flex',
            justifyContent:'flex-end',
            zIndex:'1200'
        }
    },
    {
        nameTag:'category_child',
        style:{
            minHeight:'50px',
            width:'100%',
            display:'flex',
            flexDirection:'column',
            rowGap:'10px',
            overflow:'hidden',
            height:'0',
            transition:'all linear 1s'
        }
    },
    {
        nameTag:'category_child_colors',
        style:{
            minHeight:'50px',
            width:'100%',
            display:'flex',
            flexDirection:'row',
            rowGap:'10px',
            columnGap:'15px',
            overflow:'hidden',
            height:'0'
        }
    }
])

sydDOM.bodySideNav = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.bodySideNav_style({method:'add',style:{display:preState(['bodySideNav','d'],'none')}}),
            // class:'floatBodyContent'
        },
        [
            sydDOM.bodySideNav_child()
        ],
        {
            createState:{
                stateName:'bodySideNav',
                state:{d:'none'}
            },
            type:'bodySideNav'
        }
    )
}

sydDOM.bodySideNav_child = () =>{
    remove_bodySideNav = () =>{
        const bodySideNav = getState('bodySideNav');
        const container = getState('container');
        container.ov = 'scroll'
        bodySideNav.d = 'none';
        useState('bodySideNav',{type:'a',value:bodySideNav})
        useState('container',{type:'a',value:container})
    }
    return createElement(
        'div',
        {
            style:'height:100%;width:600px;max-width:100%;background:#fff;position:relative;padding:50px 10px;padding-top:5px;overflow:scroll;font-size:13px;user-select: none;',
            class:'animateEntrance_bodySideNav_child',
            tabindex:'0',
            onblur:'remove_bodySideNav()'
        },
        [
            createElement(
                'i',
                {
                    style:styleComponent.menuBox({method:'add',style:{position:'absolute',top:'10px',right:'10px'}}),
                    class:"fa-solid fa-xmark",
                    onclick:'remove_bodySideNav()'
                }
            ),
            sydDOM.showSelectedFilters(),
            sydDOM.applyFilterBtn(),
            sydDOM.category_child1(),
            sydDOM.category_child2(),
            sydDOM.category_child3(),
            sydDOM.category_child4()
        ],
        {
            createState:{
                stateName:'bodySideNav_child',
                state:{
                    drop:{category:false,price:false},
                    filter:{}
                }
            },
            type:'bodySideNav_child'
        }
    )
}

sydDOM.applyFilterBtn = () =>{
    applyFilterToSearch = () =>{
        const bodySideNav_child = preState(['bodySideNav_child'],{});
        const mainDisplayPanel = getState('mainDisplayPanel')
        mainDisplayPanel.children = [];
        useState('mainDisplayPanel',{type:'a',value:mainDisplayPanel})
        const transferable = {}
        Object.assign(transferable,bodySideNav_child.filter)
        console.log(bodySideNav_child)
        for(let i = 0; i < Object.keys(bodySideNav_child.filter).length; i++)
        {
            let data = bodySideNav_child.filter[Object.keys(bodySideNav_child.filter)[i]];

            switch(Object.keys(bodySideNav_child.filter)[i])
            {
                case 'size':
                    let s_1 = data.split('-')
                    s_1.forEach((val,idx) =>{
                        s_1[idx] = Number(val.split('inch')[0])
                    })
                    transferable[Object.keys(bodySideNav_child.filter)[i]] = s_1
                break;
                case 'price':
                    let p_1 = data.split('-');
                    p_1.forEach((val,idx) =>{
                        p_1[idx] = val.split(' ').join('');
                        p_1[idx] = Number(p_1[idx].split(',').join(''))
                    })
                    transferable[Object.keys(bodySideNav_child.filter)[i]] = p_1;
            }
        }
        sendSocket_msg({data:new serverPackage({msg:transferable,type:'apply-filter'})})
        virtualDom['bodySideNav_child'].blur()
    }
    return createElement(
        'div',
        {
            style:`padding:10px 15px;font-weight:500;width:fit-content;margin-bottom:10px;display:${Object.keys(preState(['bodySideNav_child','filter'],{})).length > 0 ? 'block' : 'none'}`,
            class:'thinBorder click',
            onclick:'applyFilterToSearch()'
        },
        [
            'Apply Filter'
        ]
    )
}

sydDOM.showSelectedFilters = () =>{
    const renderElem = () =>{
        const stateData = preState(['bodySideNav_child','filter'],{});
        const elements = new Array()
        for(let i = 0; i < Object.keys(stateData).length; i++)
            {
                elements.push(
                    sydDOM.showSelectedFilters_elem({index:i})
                )
            }
        return elements
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;padding:5px;margin-bottom:10px;display:flex;column-gap:10px;row-gap:10px;flex-wrap:wrap;padding-right:60px'
        },
        [
            ...renderElem()
        ]
    )
}

sydDOM.showSelectedFilters_elem = ({index}) =>{
    const elem_data = preState(['bodySideNav_child','filter'],{});
    removeFilter_elem = (index) =>{
        const bodySideNav_child = getState('bodySideNav_child');
        delete bodySideNav_child.filter[`${Object.keys(bodySideNav_child.filter)[index]}`]
        useState('bodySideNav_child',{type:'a',value:bodySideNav_child})
    }
    return createElement(
        'div',
        {
            style:'padding:15px 30px;position:relative',
            class:'thinBorder'
        },
        [
            createElement('i',{style:'height:8px;width:8px;font-size:8px;position:absolute;top:3px;right:3px;',class:"fa-solid fa-xmark click",onclick:`removeFilter_elem(${index})`}),
            createElement('p',{style:'height:fit-content;background:#e7e7e7;width:fit-content;font-size:11px;position:absolute;top:3px;left:3px;font-weight:600'},[`*${Object.keys(elem_data)[index]}`]),
            createElement('p',{style:'text-transform:uppercase;font-weight:500;'},[elem_data[`${Object.keys(elem_data)[index]}`]])
        ]
    )
}

sydDOM.filterHeader = ({content}) =>{
    openCloseFilter = (type,elem) =>{
        const bodySideNav_child = getState('bodySideNav_child');

        bodySideNav_child.drop[type] === true ? (bodySideNav_child.drop[type] = false,elem.parentElement.style.height = '0') : (bodySideNav_child.drop[type] = true,elem.parentElement.style.height = 'fit-content');
        

        switch(bodySideNav_child.drop[type])
        {
            case true:

        }
    }
    return createElement(
        'p',
        {
            style:'width: 100%;transition:all linear .2s;font-size:16px;font-weight:500;min-height:50px;display:flex;align-items:center;border-bottom:1px solid lightgrey;cursor:pointer;text-transform:uppercase',
            onclick:`openCloseFilter('${content}',this)`
        },
        [
            content
        ]
    )
}
sydDOM.filterContent = ({content,parent}) =>{
    addFilter = (content,parent) =>{
        // elem.children[0].checked = elem.children[0].checked === true ? false : true
        const bodySideNav_child = getState('bodySideNav_child');
        bodySideNav_child.filter[parent] = content
        useState('bodySideNav_child',{type:'a',value:bodySideNav_child});
        console.log(getState('bodySideNav_child'))
    }
    const check_or_not = () =>{
        const bool = preState(['bodySideNav_child','filter',parent],'') === content ? true : false
        return bool ? {checked:true} : {}
    }
    return createElement(
        'li',
        {
            style:'padding:2px 20px;text-transform:capitalize;display:flex;align-items:center;column-gap:15px;cursor:pointer;width:fit-content;',
            class:'smallClickBg',
            onclick:`addFilter('${content}','${parent}')`
        },
        [
            createElement('input',{type:'checkbox',...check_or_not(),style:'height:15px;width:15px;pointer-events:none;'}),
            content
        ]
    )
}

sydDOM.filterContent_color = ({content,parent}) =>{
    const check_or_not = () =>{
        const bool = preState(['bodySideNav_child','filter',parent],'') === content ? true : false
        return bool
    }
    return createElement(
        'div',
        {
            style:`padding:10px;text-transform:capitalize;display:flex;column-gap:5px;cursor:pointer;width:fit-content;margin-left:20px;border:1px solid ${check_or_not() === true ? '#171717' : 'unset'}`,
            class:'smallClickBg',
            onclick:`addFilter('${content}','${parent}')`
        },
        [
            createElement(
                'div',
                {
                    style:`min-height:15px;min-width:15px;height:15px;width:15px;border-radius:50%;border:1px solid lightgrey;background:${content}`
                }
            ),
            content
        ]
    )
}

sydDOM.category_child1 = () =>{
    const renderMenu = () =>{
        const elements = preState(['container' , 'jetBrands'],['hp' , 'dell' , 'lenovo' , 'acer' , 'apple']);
        const array = [];
        elements.forEach(val =>{
            array.push(
                sydDOM.filterContent({content:`${val}`,parent:'category'})
            )
        })
        
        return array;
    }
    return createElement(
        'div',
        {
            style:styleComponent.category_child(),
            // class:'thinBorder'
        },
        [
            sydDOM.filterHeader({content:'category'}),
            ...renderMenu()
            // sydDOM.filterContent({content:'hp',parent:'category'}),
            // sydDOM.filterContent({content:'dell',parent:'category'}),
            // sydDOM.filterContent({content:'acer',parent:'category'}),
            // sydDOM.filterContent({content:'apple',parent:'category'}),
            // sydDOM.filterContent({content:'lenovo',parent:'category'}),

        ]
    )
}

sydDOM.category_child2 = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.category_child({method:'add',style:{columnGap:'0',flexDirection:'row',flexWrap:'wrap'}}),
            // class:'thinBorder'
        },
        [
            sydDOM.filterHeader({content:'color'}),
            sydDOM.filterContent_color({content:'white',parent:'color'}),
            sydDOM.filterContent_color({content:'red',parent:'color'}),
            sydDOM.filterContent_color({content:'blue',parent:'color'}),
        ]
    )
}

sydDOM.category_child3 = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.category_child(),
            // class:'thinBorder'
        },
        [
            sydDOM.filterHeader({content:'price'}),
            sydDOM.filterContent({content:'130,000 - 150,000',parent:'price'}),
            sydDOM.filterContent({content:'150,000 - 200,000',parent:'price'}),
            sydDOM.filterContent({content:'200,000 - 250,000',parent:'price'}),
            sydDOM.filterContent({content:'250,000 - 300,000',parent:'price'}),
            sydDOM.filterContent({content:'300,000 - 350,000',parent:'price'}),
            sydDOM.filterContent({content:'350,000 - 400,000',parent:'price'}),
        ]
    )
}

sydDOM.category_child4 = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.category_child(),
            // class:'thinBorder'
        },
        [
            sydDOM.filterHeader({content:'size'}),
            sydDOM.filterContent({content:'11inch - 12inch',parent:'size'}),
            sydDOM.filterContent({content:'12inch - 13inch',parent:'size'}),
            sydDOM.filterContent({content:'13inch - 14inch',parent:'size'}),
            sydDOM.filterContent({content:'14inch - 15inch',parent:'size'}),
            sydDOM.filterContent({content:'15inch - 16inch',parent:'size'}),
        ]
    )
}