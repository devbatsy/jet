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

ws = new WebSocket('wss://jet-i87x.onrender.com/');
// ws = new WebSocket('wss://5322-105-112-113-65.ngrok-free.app');
let socketConnection = false;
let timer,connection_count = 0

function reconnect()
{
    ws = new WebSocket('wss://jet-i87x.onrender.com');
    reconnectionInit()
}

sendSocket_msg = ({data}) =>{

    switch(socketConnection)
    {
        case true:
            ws.send(
                JSON.stringify(data)
            )
        break;
        default:
            alert('connection closed, reloading');
            location.reload()
    }
}

ws.addEventListener('open', () =>{
    socketConnection = true;
    reconnectionInit()
    switch(webType)
    {
        case 'advert':
            sendSocket_msg({data:new serverPackage({msg:{F1:category},type:'init-req'})})
        break;
        default:
            sendCartUpdate()
    }
    
})

function reconnectionInit()
    {
        ws.addEventListener('message',({data}) =>{
            const parsed = JSON.parse(data);
            console.log('hey')
            switch(parsed.post)
            {
                case 'client':
                    switch(parsed.type)
                    {
                        case 'init-req':
                            renderIntoDisplayPanel(parsed.msg)
                        break;
                        case 'update-cart':
                            updateCartInfo(parsed.msg)
                        break;
                        case 'checkout-invoice':
                            const payButton = getState('payButton');
                            payButton.process = false;
                            useState('payButton',{type:'a',value:payButton})
                            window.location = parsed.msg
                    }
            }
        })
    
        ws.addEventListener('close',() =>{
            socketConnection = false
        })
    }

function renderIntoDisplayPanel(message)
{
    const mainDisplayPanel = getState('mainDisplayPanel')
    mainDisplayPanel.children = message;
    useState('mainDisplayPanel',{type:'a',value:mainDisplayPanel})

    sendCartUpdate()
}

function sendCartUpdate()
{
    const regularizeCartInfo = cartInfo.split('|')
    const cart1 = getState('cart1');
    switch(true)
    {
        case cartInfo.length > 0:
            cart1.cartItems = regularizeCartInfo.length;
            useState('cart1',{type:'a',value:cart1});

            // regularizeCartInfo.forEach((val,id) =>{
            //     regularizeCartInfo[id] = val.split('[')[0]
            // })
        
            // console.log(regularizeCartInfo);

            sendSocket_msg({data:new serverPackage({msg:regularizeCartInfo,type:'update-cart'})})
    }
}

function updateCartInfo(message)
{
    const floatBodyContent_cart1 = getState('floatBodyContent_cart1')
    floatBodyContent_cart1.cartInfo = message;
    useState('floatBodyContent_cart1',{type:'a',value:floatBodyContent_cart1});

    switch(webType)
    {
        case 'checkout':
            const paymentInfo = getState('paymentInfo');
            paymentInfo.invoice = message;
            useState('paymentInfo',{type:'a',value:paymentInfo})
    }
}
