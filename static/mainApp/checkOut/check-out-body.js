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
} from '../../../sydneyLib/sydneyDom.js';

setStyle([
    {
        nameTag:'mainBodyContent',
        style:{
            width:'100%',
            background:'inherit',
            rowGap:'20px',
            paddingBottom:'80px',
            position:'relative',
            height:'fit-content',
            padding:'10px',
            display:'flex',
            flexWrap:'wrap',
            columnGap:'20px',
            justifyContent:'center',
        }
    },
    {
        nameTag:'foldable_div',
        style:{
            height:'fit-content',
            width:'100%',
            display:'flex',
            columnGap:'10px',
            rowGap:'10px'
        }
    },
    {
        nameTag:'input_cont_style',
        style:{
            height:'fit-content',
            width:'100%',
            minWidth:'200px',
            display:'flex',
            flexDirection:'column',
            rowGap:'8px',
        }
    },
    {
        nameTag:'normText',
        style:{
            fontWeight:'300',
            color:'#000'
        }
    },
    {
        nameTag:'threeDgreen',
        style:{
            minHeight:'40px',
            // minWidth:'50px',
            background:'#363636',
            borderColor:'#53595e',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            color:'#fff',
            fontWeight:'900',
            width:'80%'
        }
    }
])

sydDOM.check_out_tab = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.mainBodyContent()
        },
        [
            sydDOM.formTab(),
            sydDOM.paymentInfo()
        ]
    )
}

sydDOM.customerNote = () =>{
    return createElement(
        'p',
        {
            style:'padding:20px;background:lightgrey;font-size:14px;width:100%'
        },
        [
            createElement('strong',{},['Note: ']),'Delivery charges will be applied based on your location'
        ]
    )
}

sydDOM.formTab = () =>{
    return createElement(
        'div',
        {
            style:'display:flex;flex-direction:column;row-gap:10px;padding:5px;height:fit-content;width:60%;align-items:center;',
            class:'form_tab_checkout'
        },
        [
            sydDOM.customerNote(),
            createElement(
                'div',
                {
                    style:styleComponent.foldable_div(),
                    class:'foldable_div'
                },
                [
                    sydDOM.input_cont({name:'fname',content:'First name',type:'text',id:'fname_id'}),
                    sydDOM.input_cont({name:'lname',content:'Last name',type:'text',id:'lname_id'})
                ]
            ),
            sydDOM.input_cont({name:'h_ad_name',content:'House address',type:'text',id:'h_ad_id',ph:'House number and street name'}),
            sydDOM.input_cont({name:'tname',content:'Town name',type:'text',id:'tname_id'}),
            sydDOM.input_cont({name:'pname',content:'phone',type:'number',id:'pname_id'}),
            sydDOM.input_cont({name:'ename',content:'Email address',type:'email',id:'email_id'}),
            sydDOM.addDeliveryInfo()
        ],
        {
            createState:{
                stateName:'formTab',
                state:{
                    data:{
                        fname:'',lname:'',h_ad_name:'',tname:'',pname:'',ename:''
                    },
                    fault:['fname','lname','h_ad_name','pname','ename','tname']
                }
            },
            type:'formTab'
        }
    )
}

sydDOM.paymentInfo = () =>{
    const invoiceInfo = () =>{
        const paymentInfo_el = preState(['paymentInfo','invoice'],[])
        const elements = new Array()

        for(let i = 0; i < paymentInfo_el.length; i++)
        {
            elements.push(
                sydDOM.invoice_el({index:i})
            )
        }

        return elements
    }

    addPayMethod = (type) =>{
        const payButton = getState('payButton');
        payButton.pay_type = type;
        useState('payButton',{type:'a',value:payButton});
    }
    return createElement(
        'div',
        {//background: #B6A4B6;
            style:'height:fit-content;max-height:350px;overflow-y:scroll;min-height:200px;background:#cccccc;position:relative;padding:10px;padding-top:0;display:flex;flex-direction:column;row-gap:20px;align-items:center;font-family:monospace',
            class:'thinBorder paymentInfo_tab'
        },
        [
            createElement('p',{style:'width: 100%;text-decoration:underline;transition:all linear .2s;font-size:20px;font-weight:500;line-height:50px;text-align:center;'},['Payment Invoice']),
            sydDOM.invoice_el_def(),
            ...invoiceInfo(),
            sydDOM.invoice_el_end(),
            createElement(
                'div',
                {
                    style:'display:flex;row-gap:20px;width:100%;flex-direction:column'
                },
                [
                        createElement('label',{style:'cursor:pointer;display:flex;align-items:center;column-gap:10px;width:fit-content'},['Pay With Bank Transfer',createElement('input',{type:'radio',onclick:'addPayMethod("transfer")',checked:true,name:'rad'})]),

                        // createElement('label',{style:'cursor:pointer;display:flex;align-items:center;column-gap:10px;width:fit-content'},['Pay With Card',createElement('input',{onclick:'addPayMethod("card")',type:'radio',name:'rad'})]),
                ]
            ),
            createElement(
                'div',
                {
                    style:'padding:10px;background:#fff;border-radius:15px;'
                },
                [
                    // createElement('p',{style:''},[
                    //     createElement('strong',{},['NOTE: ']),'PAYMENT BY CARD ATTRACT A SERVICE CHARGE OF 3.8% OF ANY PURCHASE'
                    // ]),
                    createElement('p',{style:'margin-top:10px;'},[
                        createElement('strong',{},['NOTE: ']),'PAYMENT BY BANK TRANSFER WILL ATTRACT A SERVICE CHARGE OF 1.4% FOR ANY PURCHASE, CAPPED AT ₦2050 (MAX-CHARGE)'
                    ])
                ]
            ),
            sydDOM.payButton()
        ],
        {
            createState:{
                stateName:'paymentInfo',
                state:{invoice:[]}
            },
            type:'paymentInfo'
        }
    )
}

sydDOM.invoice_el_def = () =>{
    return createElement(
        'div',
        {
            style:sydDOM.invoice_el({}).inherit(['attribute','style']) + 'font-weight:700;border-bottom:1px solid #171717;position:sticky;top:0;background:inherit;'
        },
        [
            createElement('p',{style:'width:50%;'},['PRODUCTS (N/A)']),
            createElement('p',{style:'width:50%;text-align:center;font-family:"Plus Jakarta Sans", sans-serif;'},[`(₦) PRICE`])
        ]
    )
}

sydDOM.invoice_el_end = () =>{

    const getTotalCart = () =>{
        const paymentInfo_el = preState(['paymentInfo','invoice'],[]);
        let subTotal = 0
        for(let i = 0; i < paymentInfo_el.length; i++)
        {
            subTotal += paymentInfo_el[i].price * Number(paymentInfo_el[i].count);
            subTotal = subTotal * 0.038 < 2050 ? (subTotal + (subTotal * 0.038)) : subTotal + 2050
        }
        return `₦ ${subTotal}`
    }

    return createElement(
        'div',
        {
            style:sydDOM.invoice_el({}).inherit(['attribute','style']) + 'font-weight:700;border-top:1px solid #171717;position:sticky;top:0;background:inherit;font-size:16px;'
        },
        [
            createElement('p',{style:'width:50%;'},['SUBTOTAL']),
            createElement('p',{style:'width:50%;text-align:center;font-family:"Plus Jakarta Sans", sans-serif;'},[getTotalCart()])
        ]
    )
}

sydDOM.invoice_el = ({index = 0}) =>{
    return createElement(
        'div',
        {
            style:'width:100%;display:flex;column-gap:10px;font-size:12px;align-items:center;row-gap:20px;padding:5px;'
        },
        [
            createElement('p',{style:'width:50%;'},[getInvoiceInfo(index,'name')]),
            createElement('p',{style:'width:50%;text-align:center;font-family:"Plus Jakarta Sans", sans-serif;'},['₦ '+getInvoiceInfo(index,'price')])
        ]
    )
}

sydDOM.payButton = () =>{
    payInvoice = () =>{
        const payButton = getState('payButton');
        switch(true)
        {
            case preState(['formTab','fault'],[]).length > 0:
                console.log(preState(['formTab','fault'],[]))
                useState('formTab',{type:"a",value:getState('formTab')})
                alert('please enter all field')
            break;
            default:
                payButton.process = true
                useState('payButton',{type:'a',value:payButton});
                const msg = {
                    contactInfo:getState('formTab').data,
                    invoice:getState('paymentInfo').invoice.map(val =>{return [val.id,val.count]})
                }
                msg.pay_type = payButton.pay_type;
                sendSocket_msg({data:new serverPackage({msg:msg,type:'checkout-invoice'})})
        }
    }
    return createElement(
        'div',
        {
            style:'padding:10px 40px;font-weight:600;font-size:14px;text-transform:capitalize;position:sticky;bottom:10px;' + styleComponent.threeDgreen(),
            class:'click pressDBtn',
            onclick:'payInvoice()'
        },
        [
            `pay with ${preState(['payButton','pay_type'],'transfer')}`,
            preState(['payButton','process'],false) ? sydDOM.loader() : ''
        ],
        {
            createState:{
                stateName:'payButton',
                state:{process:false,pay_type:'transfer'}
            },
            type:'payButton'
        }
    )
}

sydDOM.input_cont = ({name,type,id,content,ph = ''}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.input_cont_style(),
            class:preState(['formTab','fault'],[]).includes(name) === true ? 'faulty' : ''
            // class:'thinBorder',
        },
        [
            createElement('p',{style:styleComponent.normText()},[`${content}`,createElement('sup',{style:'color:red'},['*'])]),
            sydDOM.mainInput({name:name,type:type,id:id,ph:ph,content:content})
        ]
    )
}

sydDOM.mainInput = ({name,type,id,ph,content}) =>{
    checkoutFormInput = (name,element) =>{
        const formTab = getState('formTab');
        formTab.data[`${name}`] = element.value;
        switch(true)
        {
            case element.value.length > 0:
                switch(formTab.fault.includes(name))
                {
                    case true:
                        formTab.fault.splice(formTab.fault.indexOf(name),1)
                }
            break;
            default:
                switch(!formTab.fault.includes(name))
                {
                    case true:
                        formTab.fault.push(name)
                }
        }
        useState('formTab',{type:'a',value:formTab});

    }
    return createElement(
        'input',
        {
            style:'height:50px;width:100%;border:1px solid #171717;background:transparent;font-size:17px;padding:5px;padding-left:20px;',
            type:type,
            name:name,
            id:id,
            placeholder:ph,
            title:content,
            oninput:`checkoutFormInput('${name}',this)`,
        }
    )
}

sydDOM.addDeliveryInfo = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.input_cont_style()
        },
        [
            createElement(
                'p',
                {
                    style:'width: 100%;transition:all linear .2s;font-size:20px;font-weight:500;line-height:50px'
                },
                [
                    'Additional Information'
                ]
            ),
            createElement('textarea',{style:'height:200px;width:100%;font-family:unset;padding:20px;',placeholder:'Notes about your order'})
        ]
    )
}