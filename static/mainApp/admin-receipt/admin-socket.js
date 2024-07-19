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

const ws = new WebSocket('ws://localhost:9090');

ws.addEventListener('open',() =>{
    
    ws.addEventListener('message',({data}) =>{
        const parsed = JSON.parse(data)
        switch(parsed.type)
        {
            case 'reciept':
                const receipts = getState('receipts');
                receipts.data = parsed.msg;
                useState('receipts',{type:'a',value:receipts})
        }
    })

    ws.send(JSON.stringify({post:'server',type:'admin-reciept'}))

})