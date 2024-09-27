import { __g, __u , __p, __v} from "../../sydneyLib/sydneyDom_v2.js";

socket = new WebSocket('http:localhost:9090/');

socket.addEventListener('open', () =>{
    socket.send(
        JSON.stringify({
            post:'server',
            type:'admin_brand_req'
        })
    )
})

socket.addEventListener('message' , ({data}) =>{
    const parsed = JSON.parse(data);
    switch(parsed.type)
    {
        case 'admin_brand':{ 
            const state = __g('sideNav');
            state.children = parsed.data;
            __u('sideNav' , {type:'a' , value:state});

            document.querySelector('.nav_animator').style.display = 'none'

            socket.send(
                JSON.stringify({
                    post:'server',
                    type:'admin_product_req',
                    brand:__p(['sideNav' , 'cBrand'],'hp')
                })
            )
        }
        break;
        case 'admin_brand_add':{ 
            const state = __g('sideNav');
            state.children = parsed.data;
            __u('sideNav' , {type:'a' , value:state});

            // alert('add operation successfull');
            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Brand Added successfully';

            document.querySelector('.create_brand_animator').style.display = 'none';
            __v['create_brand_btn'].style.color = 'rgba(255,255,255,1)';
            __v['create_brand_btn'].style.background = 'rgb(23, 23, 23 , 1)';
        }
        break;
        case 'admin_brand_edit':{
            const state = __g('sideNav');
            state.children = parsed.data;
            __u('sideNav' , {type:'a' , value:state})

            // alert('edit operation successfull');

            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Brand Edited successfully';

            console.log(__p(['sideNav' , 'cBrand'],'hp'))

            setTimeout(() => {
                socket.send(
                    JSON.stringify({
                        post:'server',
                        type:'admin_product_req',
                        brand:__p(['sideNav' , 'cBrand'],'hp')
                    })
                )
            }, 1500);

            close_edit_del_tab()
        }
        break;
        case 'admin_brand_del':
            const state = __g('sideNav');
            state.children = parsed.data;
            __u('sideNav' , {type:'a' , value:state})

            // alert('delete operation successfull')

            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Brand Deleted successfully';

            socket.send(
                JSON.stringify({
                    post:'server',
                    type:'admin_product_req',
                    brand:'hp'
                })
            )

            close_edit_del_tab()
        break;
        case 'admin_product_delivery':{
            
            const state = __g('mainDisplay_admin');
            state.pElem = parsed.parcel;
            __u('mainDisplay_admin' , {type:'a' , value:state});

            document.querySelector('.main_board_animator').style.display = 'none';

            console.log(parsed.parcel.length)
            if(parsed.parcel.length < 1)
            {
                document.querySelector('.product_not_found').style.display = 'block';
            }else{
                document.querySelector('.product_not_found').style.display = 'none'
            }
        }
        break;
        case 'add_admin_product_sendID':{

            const state = __g('mainDisplay_admin');
            const newProduct = new newProductTemplate();
            newProduct.type = __p(['sideNav' , 'cBrand'],'hp');
            newProduct.productID = parsed.productID
            state.pElem.push(newProduct);
            __u('mainDisplay_admin' , {type:'a' , value:state});

            const products = document.querySelectorAll('.product');
            products[products.length-1].scrollIntoView();

            __v['add_product_btn'].style.color = 'rgba(255,255,255,1)';
            __v['add_product_btn'].style.background = 'rgba(23,23,23,1)';
            document.querySelector('.add_product_animator').style.display = 'none';
        }
    break;
    case 'delete_admin_product_feedback':{
        parsed.status === 'success' ? success() : fail()
        function success()
        {
            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Product Delete Successfull';
        }

        function fail()
        {
            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Product Deleted failed';
        }
    }
    break;
    case 'save_admin_product_res':{

        __v['save_change_btn'].style.color = 'rgba(255,255,255,1)';
        __v['save_change_btn'].style.background = 'rgba(23,23,23,1)';
        document.querySelector('.save_change_animator').style.display = 'none';

        if(parsed.status === 'success')
        {
            // alert('Products saved successfully')
            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Products saved successfully';
        }else{
            // alert('Failed to save products')
            __v['animate_pop_up'].style.display = 'flex';
            __v['animate_pop_up'].innerHTML = 'Failed to save products';
        }
    }
    }
})