import {
    createElement,
    virtualDom,
    mount,
    styleComponent,
    setStyle,
    sydDOM,
    getState,
    preState,
    useState,
} from '../../../sydneyLib/sydneyDom.js'

setStyle([
    {
        nameTag:'bodySubNavChild',
        style:{
            height:'40px',
            // minWidth:'200px',
            width:'fit-content',
            display:'flex',
            columnGap:'10px',
            alignItems:'center',
            padding:'0 10px',
        }
    }
])

sydDOM.bodySubNav = () =>{
    return createElement(
        'div',
        {
            style:'padding:10px;width:100%;display:flex;justify-content:space-around;row-gap:20px;column-gap:20px;flex-wrap:wrap',
            class:'thinBorder'
        },
        [
            sydDOM.resizeMainTabDiv(),
            sydDOM.sortByElemContainer()
        ]
    )
}

sydDOM.resizeMainTabDiv = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.bodySubNavChild({method:'add',style:{display:preState(['resizeMainTabDiv','d'],'flex')}})
        },
        [
            sydDOM.resizeMainTabDiv_child({content:'0'}),
            sydDOM.resizeMainTabDiv_child({content:'2'}),
            sydDOM.resizeMainTabDiv_child({content:'3'}),
            sydDOM.resizeMainTabDiv_child({content:'4'}),
        ],
        {
            createState:{
                stateName:'resizeMainTabDiv',
                state:{d:'flex',nonDisplay:[],currentClick:'0'}
            },
            type:'resizeMainTabDiv'
        }
    )
}

sydDOM.resizeMainTabDiv_child = ({content}) =>{
    changeMainPanelDyn = (id) =>{
        const mainDisplayPanel = getState('mainDisplayPanel');
        const resizeMainTabDiv = getState('resizeMainTabDiv');
        resizeMainTabDiv.currentClick = id
        switch(true)
        {
            case id !== '0':
                mainDisplayPanel.childSize = Number(id);
                mainDisplayPanel.renderMode = 'tab'
            break;
            default:
                mainDisplayPanel.renderMode = 'capsule'
        }
        useState('mainDisplayPanel', {type:'a',value:mainDisplayPanel})
        useState('resizeMainTabDiv',{type:'a',value:resizeMainTabDiv})
    }
    return createElement(
        'div',
        {
            style:styleComponent.smallClickBox() + `text-align:center;display:${preState(['resizeMainTabDiv','nonDisplay'],[]).includes(`${content}`) ? 'none' : 'block'};opacity:${preState(['resizeMainTabDiv','currentClick'],'0') === content ? '1' : '.6'};` + styleComponent.bg({method:'add',style:{backgroundImage:`url(../assets/${content}Tab.png)`}}),
            onclick:`changeMainPanelDyn('${content}')`,
            class:'click'
        },
        []
    )
}

sydDOM.sortByElemContainer = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.bodySubNavChild() + 'padding-top:5px;padding-bottom:5px;'
        },
        [
            createElement('i',{class:"fa-solid fa-arrow-up-wide-short"}),
            sydDOM.dropDown()
        ],
        {
            createState:{
                stateName:'sortByElemContainer',
                style:{filter:'',searchParam:''}
            },
            type:'sortByElemContainer'
        }
    )
}

sydDOM.dropDown = () =>{
    togDropDown = () =>{
        const dropMain = getState('dropMain');
        dropMain.d = 'flex';
        useState('dropMain',{type:'a',value:dropMain})
    }

    dropDownBlur = () =>{
        const dropMain = getState('dropMain');
        dropMain.d = 'none';
        useState('dropMain',{type:'a',value:dropMain})
    }
    return createElement(
        'div',
        {
            style:`height:100%;width:fit-content;min-width:150px;position:relative;display:flex;align-items:center;text-transform:capitalize;cursor:pointer;align-self:flex-end;font-size:14px`,
            onblur:'dropDownBlur()',
            tabindex:'0',
            class:'thinBorder'
        },
        [
            createElement(
                'p',
                {style:'padding:0 10px;width:100%;height:100%;display:flex;align-items:center',onclick:'togDropDown()'},
                [
                    createElement('div',{style:'font-weight:600'},[preState(['dropDown','current'],'filter by')])
                ]
            ),
            sydDOM.dropMain()
        ],
        {
            createState:{
                stateName:'dropDown',
                state:{current:'select'}
            },
            type:'dropDown'
        }
    )
}

sydDOM.dropMain = () =>{
    const price_sort = (order) =>{
        const array = getState('mainDisplayPanel').children;
        const newArranged = [];
        let index;
        
        function arrange()
        {
            index = 0;
            for(let i = 0; i < array.length; i++)
            {
                if(array[i].price < array[index].price)
                {
                    index = i;
                }
            }
            switch(order)
            {
                case 1:
                    newArranged.unshift(array[index]);
                break;
                default:
                    newArranged.push(array[index]);
            }
            array.splice(index,1);
        
            if(array.length > 0)
            {
                arrange();
            }
        }

        const mainDisplayPanel = getState('mainDisplayPanel')
        mainDisplayPanel.children = [];
        useState('mainDisplayPanel',{type:'a',value:mainDisplayPanel});

        arrange()

        const mainDisplayPanel2 = getState('mainDisplayPanel')
        mainDisplayPanel2.children = newArranged;
        useState('mainDisplayPanel',{type:'a',value:mainDisplayPanel2});
    }
    updateDate = (content) =>{
        switch(content === 'sort by price : low to high' || content === 'sort by price : high to low')
        {
            case true:{
                let order = content === 'sort by price : high to low' ? 1 : 0
                price_sort(order)
            }
        }

        
        const dropDown = getState('dropDown');
        const dropMain = getState('dropMain');
        const sortByElemContainer = getState('sortByElemContainer')
        dropMain.d = 'none';
        dropMain.filter = content
        dropDown.current = content;
        sortByElemContainer.filter = content;
        sortByElemContainer.searchParam = ''
        useState('dropDown',{type:'a',value:dropDown})
        useState('dropMain',{type:'a',value:dropMain});
        useState('sortByElemContainer',{type:'a',value:sortByElemContainer});

    }
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;position:absolute;z-index:999;top:calc(100% + 1px);left:0;background:#fff',
            class:'thinBorder'
        },
        [
            createElement(
                'div',
                {
                    style:`height:fit-content;padding:5px;width:100%;display:${preState(['dropMain','d'],'none')};flex-direction:column;row-gap:5px;`
                },
                [
                    createElement('p',{class:'dropList',onclick:`updateDate('default sorting')`},['default sorting']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by popularity')`},['sort by popularity']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by average rating')`},['sort by average rating']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by latest')`},['sort by latest']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by price : high to low')`},['sort by price : high to low']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by price : low to high')`},['sort by price : low to high']),
                    createElement('p',{class:'dropList',onclick:`updateDate('sort by best selling')`},['sort by best selling']),
                ]
            )
        ],
        {
            createState:{
                stateName:'dropMain',
                state:{d:'none'}
            },
            type:'dropMain'
        }
    )
}