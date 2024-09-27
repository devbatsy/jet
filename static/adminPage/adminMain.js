import { __SYD , __c, __p , __g , __u, createElement, __v} from "../../sydneyLib/sydneyDom_v2.js";

const array = [
    {
        Name:'fdjgkdfg',
        brand:'fdjgkdfgd43534',
        color:'3894jkfbkgd',
        size:'fdgk',
        gen:'1th gen',
    }
]

const propMapping = [
    ['Product ID' , 'productID'] , ['name','name'] , ['price','price_no'] , ['brand' , 'type'] , ['ram','ram'] , ['generation','generation'] , ['cpu','processor'] , ['size','size_no'] , ['physical prop','moreInfo'] , ['color' , 'color'] , ['available copies' , 'copies'] , ['used or new' , 'useCase']
]

const PcInfo = ['name' , 'brand' , 'color' , 'size' , 'gen'];

__SYD.uploadImageForm = () =>
    {
        return __c(
            'form',
            {
                method:'POST' , 
                action:'/upload_product_image',
                style:'visibility:hidden;pointer-events:none;'
            },
            [
                __c(
                    'input',
                    {
                        type:'file',
                        name:__p(['uploadImageForm' , 'imgName'],'null'),
                        id:'product_image_download',
                    },[],
                    {
                        events:
                        {
                            onchange:async (e) =>{
                                // console.log('image uploaded successfully');

                                const file = e.target.files[0];
                                const formData = new FormData()
                                formData.append('file' , file)
                                formData.append('productID' , __p(['uploadImageForm' , 'imgName'],'pic'));

                                __v['animate_pop_up'].style.display = 'flex';
                                __v['animate_pop_up'].innerHTML = 'uploading image ...';

                                const res = await fetch(
                                    '/upload_product_image',{
                                        method:'post',
                                        body:formData
                                    }
                                )

                                const response = await res.json().then(data =>{
                                    console.log(data.productID);
                                    const state = __p(['mainDisplay_admin']);
                                    let index;
                                    for(let i = 0; i < state.pElem.length; i++)
                                    {
                                        if(state.pElem[i].productID === data.productID)
                                        {
                                            index = i;
                                            break;
                                        }
                                    }

                                    if(index !== undefined)
                                    {
                                        const state = __g('mainDisplay_admin');
                                        state.pElem[index].productImg = data.imageURL;
                                        __u('mainDisplay_admin' , {type:"a" , value:state})

                                        __v['animate_pop_up'].style.display = 'none';
                                        __v['animate_pop_up'].style.display = 'flex';
                                        __v['animate_pop_up'].innerHTML = 'Image upload successfull';
                                    }
                                });


                                // __v['form_submit_button'].click();
                                // __v['uploadImageForm'].submit()
                            } 
                        }
                    }
                ),
                __c('button' , {type:'submit'} , ['submit'] , {type:'form_submit_button'})
            ],
            {
                createState:{
                    stateName:'uploadImageForm',
                    state:{
                        imgName:'null',
                    }
                },
                events:{
                    onsubmit:(e) =>{
                        // e.preventDefault()
                    }
                }
            }
        )
    }

__SYD.mainDisplay_admin = () =>{
    const render = () =>{
        const element = __p(['mainDisplay_admin' , 'pElem'],[]);
        const result = new Array()
        for(let i = 0; i < element.length; i++)
        {
            result.push(__SYD.parentProduct_admin_main(i))
        }

        return result;
    }
    return __c(
        'div',
        {
            style:'height:100%;width:100%;background:#fff;display:flex;flex-direction:column;row-gap:20px;overflow:scroll;position:relative;padding:20px 5px;'
        },
        [
            __SYD.animator_loader({size:20 , cls:'main_board_animator'}),
            __c(
                'div',
                {
                    style:'font-weight:700;font-size:13px;padding:15px;background:#171717;color:#fff;position:absolute;bottom:10px;right:10px;z-index:100;',
                    class:'click'
                },
                [
                    'Save Changes',
                    __SYD.animator_loader({size:15 , cls:'save_change_animator' , initDisplay:'none'})
                ],
                {
                    events:{
                        onclick:(e) =>{
                            socket.send(JSON.stringify({
                                post:'server',
                                type:'save_admin_product',
                                parcel:__p(['mainDisplay_admin' , 'pElem'],[])
                            }));

                            document.querySelector('.save_change_animator').style.display = 'flex';
                            e.target.style.color = 'rgba(255,255,255,.7)';
                            e.target.style.background = 'rgb(23, 23, 23 , .7)';
                        }
                    },
                    type:'save_change_btn'
                }
            ),
            __c(
                'h2',
                {
                    style:'width:100%;text-align:left;text-decoration:underline;padding-left:30px;position:relative;'
                },
                [
                    __SYD.pop_up_tab(),
                    'PC BRANDS',
                    __c('span' , {class:'click',style:'font-size:13px;font-weight:700;width:fit-content;height:fit-content;padding:10px;background:#171717;color:#fff;position:absolute;top:100%;right:10px;z-index:100;'},['Add Products' , __SYD.animator_loader({size:10 , cls:'add_product_animator' , initDisplay:'none'})],{
                        events:{
                            onclick:(e) =>{
                                socket.send(JSON.stringify({
                                    post:'server',
                                    type:'add_admin_product_getID'
                                }));

                                document.querySelector('.add_product_animator').style.display = 'flex';
                                e.target.style.color = 'rgba(255,255,255,.7)';
                                e.target.style.background = 'rgb(23, 23, 23 , .7)';

                                //code for creating new product is on the socket page
                            }
                        },
                        type:'add_product_btn'
                    })
                ]
            ),
            __SYD.uploadImageForm(),
            __c(
                'div',
                {
                    style:"width:100%;display:flex;flex-direction:column;row-gap:20px;overflow:scroll;height:100%;padding:40px 0;"
                },
                [
                    ...render(),
                    createElement('div',{style:'height:300px;width:100%;background-image:url("../mainApp/assets/404.svg");background-position:center;background-size:contain;background-repeat:no-repeat;display:none;' , class:'product_not_found'},[],{type:'product_not_found'})
                ]
            ),
            
        ],
        {
            createState:{
                stateName:'mainDisplay_admin',
                state:{cProduct:'' , pElem:[]}
            }
        }
    )
}

__SYD.parentProduct_admin_main = (i) =>{
    const val = __p(['mainDisplay_admin' , 'pElem'],[])[i].productID;

    const render = () =>{
        const result = []
        // for(let j = 0; j < Object.keys(__p(['mainDisplay_admin' , 'pElem'],[])[i]).length; j++)
        // {
            // result.push(
            //     __SYD.render_adminMain_child_(i,j)
            // )
        // }

        propMapping.forEach(param =>{
            switch(true)
            {
                case param[0] === 'used or new':
                    result.push(
                        __SYD.render_admin_radio_used_new(param[0] , __p(['mainDisplay_admin' , 'pElem'],[])[i][param[1]] , i ,param[1])
                    )
                break;
                default:
                    result.push(
                        __SYD.render_adminMain_child_(param[0] , __p(['mainDisplay_admin' , 'pElem'],[])[i][param[1]] , i ,param[1])
                    )
            }
        })
        return result;
    }

    const productImg = __p(['mainDisplay_admin' , 'pElem'],[])[i].productImg === undefined ? '' : __p(['mainDisplay_admin' , 'pElem'],[])[i].productImg
    return __c(
        'div',
        {
            style:'width:100%;padding:5px 15px;display:flex;flex-direction:column;row-gap:10px;align-items:center;justify-content:center;',
            class:'product'
        },
        [
            __c(
                'div',
                {
                    style:'height:60px;width:100%;display:flex;align-items:center;justify-content:flex-start;padding:0 15px;',
                    class:"thinBorder click"
                },
                [
                    __p(['mainDisplay_admin' , 'pElem'],[])[i].name
                ],
                {
                    events:{
                        onclick:(e) =>{

                            const state = __g('mainDisplay_admin');
                            if(state.cProduct === val.toLowerCase())
                            {
                                state.cProduct = ''
                            }else{
                                state.cProduct = val.toLowerCase();
                            }
                            
                            __u('mainDisplay_admin' , {type:'a' , value:state})
    
                            // e.target.scrollIntoView();
                        }
                    }
                }
            ),
            __c(
                'div',
                {
                    style:`min-height:200px;width:100%;box-shadow:0 0 3px rgba(0,0,0,.3);background:#fff;display:flex;display:${__p(['mainDisplay_admin' , 'cProduct'],'').toLowerCase() === val.toLowerCase() ? 'flex' : 'none'};flex-direction:column;row-gap:15px;padding:10px 15px;padding-top:140px;position:relative;z-index:50;`,
                    class:'lightBorder_rad'
                },
                [
                    // __SYD.render_adminMain_child_()
                    __c(
                        'div',
                        {
                            style:'position:absolute;min-height:50px;height:fit-content;padding:10px;top:10px;right:10px;display:flex;column-gap:10px;'
                        },
                        [
                            __c('div' , {class:'click',style:'font-weight:700;font-size:13px;padding:10px;background:red;color:#fff;'},['Delete'] , {
                                events:{
                                    onclick:() =>
                                    {
                                        console.log(i)
                                        const state = __g('mainDisplay_admin');
                                        const productID_del = state.pElem[i].productID
                                        state.pElem.splice(i , 1);
                                        const dummyArray = state.pElem;
                                        state.pElem = [];
                                        __u('mainDisplay_admin' , {type:'a' , value:state})

                                        console.log(dummyArray)

                                        const state2 = __g('mainDisplay_admin');
                                        state2.pElem = dummyArray;
                                        __u('mainDisplay_admin' , {type:'a' , value:state2});

                                        socket.send(JSON.stringify({
                                            post:'server',
                                            type:'delete_admin_product_id',
                                            productID:productID_del
                                        }));
                                    }
                                }
                            }),
                            __c('label' , {for:'product_image_download'},[
                                __c('div' , {class:'click',style:'font-weight:700;font-size:13px;padding:10px;background:lightblue;color:#fff;'},['Upload Image'],{
                                    events:{
                                        onclick:() =>
                                        {
                                            const state = __g('uploadImageForm');
                                            state.imgName = __p(['mainDisplay_admin' , 'pElem'],[])[i].productID;
                                            __u('uploadImageForm' , {type:'a' , value:state});
                                        }
                                    }
                                }),
                            ]),
                        ]
                    ),
                    __c(
                        'img',
                        {
                            style:`height:100px;width:${productImg.length === 0 ? "100px" : 'auto'};position:absolute;top:20px;left:20px;background-image:url("${productImg}");display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;`,
                            alt:'Upload an Image',
                            class:"thinBorder click",
                            src:productImg
                        },[
                            productImg.length === 0 ? __c('label' , {for:'product_image_download'} , ['Upload Image']) : ''
                        ],{
                            genericStyle:['bg_fit'],
                            events:{
                                onclick:() =>
                                {
                                    if(productImg.length === 0)
                                    {
                                        const state = __g('uploadImageForm');
                                        state.imgName = __p(['mainDisplay_admin' , 'pElem'],[])[i].productID;
                                        __u('uploadImageForm' , {type:'a' , value:state});

                                        console.log(state.imgName)
                                    }
                                }
                            }
                        }
                    ),
                    ...render()
                ]
            )
        ]
    )
}

__SYD.render_adminMain_child_ = (key , value , i , accessKey) =>{
    const exception = ['product id' , 'brand'].includes(key.toLowerCase())
    return __c(
        'div',
        {
            style:`display:flex;column-gap:20px;align-items:center;padding:10px;background:lightgrey;border-radius:10px;opacity:${!exception ? '1' : '.5'};pointer-events:${!exception ? 'auto' : 'none'}`
        },
        [
            __c('p',{style:'width:100px;text-transform:capitalize;font-weight:700;font-size:13px;'},[key]),
            __c('input',{type:accessKey === 'price_no' ? 'number' : (accessKey === 'size_no' ? 'number' : 'text'),style:'height:30px;font-size:13px;padding-left:10px;background:#333;color:#fff;width:100%;',value:`${value === undefined ? '' : value}`},[],{
                events:{
                    oninput:(e) =>{
                        const state = __g('mainDisplay_admin');
                        switch(accessKey)
                        {
                            case 'price_no':
                                state.pElem[i][`${accessKey}`] = Number(e.target.value);
                            break;
                            case 'size_no':
                                state.pElem[i][`${accessKey}`] = Number(e.target.value);
                            break;
                            default:
                                state.pElem[i][`${accessKey}`] = e.target.value;
                        }
                        __u('mainDisplay_admin' , {type:'a' , value:state})
                    }
                }
            }),
        ]
    )
}

__SYD.render_admin_radio_used_new = (key , value , i , accessKey) =>{
    const values = () =>
    {
        const array = [];
        if(value !== undefined)
        {
            if(value.toLowerCase() === 'uk used')
                {
                    array.push({checked:true})
                }else{array.push({})}
        }else{array.push({})}

        if(value !== undefined)
        {
            if(value.toLowerCase() === 'new')
            {
                array.push({checked:true})
            }else{array.push({})};
        }else{array.push({})}
        

        return array
    }

    const decision = values();
    const decisionArray = ['uk used' , 'new']
    return __c(
        'div',
        {
            style:`display:flex;column-gap:20px;align-items:center;padding:10px;border-radius:10px;text-transform:capitalize;font-weight:700;font-size:13px;`
        },[
            __c('p',{style:'width:100px;'},[key]),
            __c(
                'div',{style:'height:100%;width:100%;display:flex;column-gap:20px;align-items:center;background:lightgrey;padding-left:10px;'},
                [
                    __c(
                        'div',
                        {
                            style:'height:30px;width:fit-content;display:flex;column-gap:10px;align-items:center;cursor:pointer;'
                        },
                        [
                            __c('label',{style:'font-size:12px;text-transform:capitalize' , for:`used_laptops_id${__p(['mainDisplay_admin','pElem'],[])[i].productID}`},[decisionArray[0]]),
                            __c('input' , {name:`rad_btn_id:${__p(['mainDisplay_admin','pElem'],[])[i].productID}`,type:'radio' , id:`used_laptops_id${__p(['mainDisplay_admin','pElem'],[])[i].productID}` , ...decision[0]},[],{
                                events:{
                                    onchange:(e) =>{
                                        const state = __g('mainDisplay_admin');
                                        state.pElem[i][`${accessKey}`] = decisionArray[0].toLowerCase();
                                        __u('mainDisplay_admin' , {type:'a' , value:state})
                                    }
                                }
                            })
                        ]
                    ),
                    __c(
                        'div',
                        {
                            style:'height:30px;width:fit-content;display:flex;column-gap:10px;align-items:center;cursor:pointer;'
                        },
                        [
                            __c('label',{style:'font-size:12px;text-transform:capitalize' , for:`new_laptops_id:${__p(['mainDisplay_admin','pElem'],[])[i].productID}`},[decisionArray[1]]),
                            __c('input' , {name:`rad_btn_id:${__p(['mainDisplay_admin','pElem'],[])[i].productID}`,type:'radio' , id:`new_laptops_id:${__p(['mainDisplay_admin','pElem'],[])[i].productID}` , ...decision[1]},[],{
                                events:{
                                    onchange:(e) =>{
                                        const state = __g('mainDisplay_admin');
                                        state.pElem[i][`${accessKey}`] = decisionArray[1].toLowerCase();
                                        __u('mainDisplay_admin' , {type:'a' , value:state});

                                        console.log(state.pElem[i])
                                    }
                                }
                            })
                        ]
                    ),
                ]
            )
        ]
    )
}

close_edit_del_tab = () =>{
    const state = __g('edit_del_tab');
    state.dis = 'none';
    state.cName = 0;
    state.edit.prevName = '';
    state.edit.newName = ''
    state.delete.cName = '';

    __u('edit_del_tab' , {type:'a' , value:state});
}


__SYD.edit_del_tab = () =>{
    // const {dis = '' , cTab = 0} = ;

    return __c(
        'div',
        {
            style:`height:100vh;width:100vw;background:rgba(0,0,0,.6);position:fixed;top:0px;left:0px;z-index:1000;display:${__p(['edit_del_tab','dis'],'none')};justify-content:center;column-gap:10px;padding:20px;align-items:center;`
        },
        [
            __c(
                'div',
                {
                    style:'height:100%;width:100%;position:absolute;top:0;left:0;z-index:100'
                },[],
                {
                    events:{
                        onclick:close_edit_del_tab
                    }
                }
            ),
            __c(
                'div',
                {
                    style:`height:fit-content;padding:20px;display:${__p(['edit_del_tab','cTab'],0) === 0 ? 'flex' : 'none'};flex-direction:column;row-gap:20px;align-items:center;background:#fff;border-radius:10px;z-index:150`
                },
                [
                    __c('input' , {class:'editInput',placeholder:'Brand Name',style:"height:30px;padding-left:15px;background:#171717;color:#fff;font-family:monospace;"}),

                    __c('div' , {style:'padding:10px 20px;background:orange;color:#fff;' , class:'click'} , ['Save'] , {
                        events:{
                            onclick:(e) =>{
                                const cInputValue = e.target.parentElement.querySelector('input').value;

                                const prevName = __p(['edit_del_tab' , 'edit' , 'prevName'] ,'');

                                const state = __g('sideNav');
                                state.cBrand = cInputValue
                                __u('sideNav' , {type:'a' , value:state})

                                socket.send(JSON.stringify({
                                    post:'server',
                                    type:'edit_admin_brand',
                                    msg:{
                                        prevName:prevName,
                                        newName:cInputValue
                                    }
                                }));

                                // close_edit_del_tab()
                            }
                        }
                    })
                ]
            ),

            __c(
                'div',
                {
                    style:`height:fit-content;padding:20px;display:${__p(['edit_del_tab','cTab'],0) === 1 ? 'flex' : 'none'};flex-direction:column;row-gap:30px;align-items:center;background:#fff;border-radius:10px;max-width:250px;width:100%;z-index:150`
                },
                [
                    __c(
                        'p',
                        {
                            style:"width:100%;text-align:center;font-weight:300;"
                        },
                        [
                            'Permanently Delete ',__c('span',{style:'color:red;font-weight:700;'},[__p(['edit_del_tab','delete','cName'],'Test')]),' Brand??'
                        ]
                    ),
                    __c(
                        'div',
                        {
                            style:'display:flex;column-gap:50px;align-items:center;justify-content:center;'
                        },
                        [
                            createElement('div' , {style:'padding:10px;font-size:14px;background:red;color:#fff;',class:'click'},['Proceed'],{
                                events:{
                                    onclick:() =>{
                                        const brandName = __p(['edit_del_tab' , 'delete' , 'cName'] ,'');

                                        socket.send(JSON.stringify({
                                            post:'server',
                                            type:'delete_admin_brand',
                                            msg:{
                                                brandName:brandName.toLowerCase()
                                            }
                                        }));
        
                                        // close_edit_del_tab()
                                    }
                                }
                            }),
                            createElement('div' , {style:'padding:10px;font-size:14px;background:#171717;color:#fff;',class:'click'},['Cancel'],{
                                events:{
                                    onclick:close_edit_del_tab
                                }
                            })
                        ]
                    )
                ]
            )
        ],
        {
            createState:{
                stateName:'edit_del_tab',
                state:{
                    cTab:0,
                    edit:{prevName:'' , newName:''},
                    delete:{cName:''},
                    dis:'none'
                }
            }
        }
    )
}