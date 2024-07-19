require('dotenv').config();
const http = require('http')
const express = require('express');
const websocket = require('ws');
const path = require('path');
const app = express()
const server = http.createServer(app);
const wss = new websocket.Server({server});
const body = require('body-parser');
const urlencoded = body.urlencoded({extended:false});
const fs = require('fs');
const stripe = require('stripe')(`${process.env.secret_key}`);
const {v4:uuidv4} = require('uuid');
const axios = require('axios')
class clientPackage{
    constructor({type,msg})
    {
        this.post = 'client';
        this.type = type;
        this.msg = msg
    }
}

const Tree = {
    tree:null,
    connection:null
}

class userInvoiceSchema{
    constructor({fname:firstName,lname:lastName,tname:town,ename:email,h_ad_name:house_address,pname:phone,invoice_id})
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.town = town;
        this.house_address = house_address;
        this.email = email;
        this.invoice_id = invoice_id;
        this.status = 'pending';
        this.url_id = `invoice-${invoice_id.slice(0,10)}-id`
    }
}

const readData = async () =>{
    const data = await fs.readFileSync('./newData.json');

    return JSON.parse(data.toString())
}

const readData_userInvoice = async () =>{
    const data = await fs.readFileSync('./userInvoice.json');

    return JSON.parse(data.toString())
}

const writeUserInvoice = async ({data}) =>{
    const writable = await fs.writeFileSync('./userInvoice.json',JSON.stringify(data))
    // .then(() =>{
        console.log('write data successfull')
    // })
}

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'static/mainApp/admin-receipt')))
app.use(express.static(path.join(__dirname,'static/mainApp/redirect')))
app.use(express.static(path.join(__dirname,'static/mainApp/checkOut')))
app.use(express.static(path.join(__dirname,'static/mainApp')))
app.use(express.static(path.join(__dirname,'static')))
app.use(express.static(path.join(__dirname,'sydneyLib/visualTree')))
app.use(express.static(path.join(__dirname,'sydneyLib')))
app.use(express.static(path.join(__dirname)))

app.get('/', (req,res) =>{
    res.render(
        path.join(__dirname,'static/mainApp/mainHtmlApp.ejs'),
        {
            webMode:'hp',
            cart:[]
        }
    )
})

app.get('/vtree',(req,res) =>{
    res.sendFile(path.join(__dirname,`./sydneyLib/visualTree/tree.html`));
})

app.get('/redirect',async (req,res) =>{
    let url_type = req.query.type;
    let url_inv_id = req.query.id;
    let status = req.query.status;
    let match = false;
    let info = '';
    let customerInfo = [];
    let productsInfo = []

    const userInvoices = await readData_userInvoice();
    const productsData = await readData();
    for(let i = 0; i < Object.keys(userInvoices).length; i++)
    {
        const unitData = userInvoices[Object.keys(userInvoices)[i]];

        if(unitData.url_id === url_inv_id)
        {
            match = true;
            customerInfo = [unitData.firstName,unitData.lastName];
            productsInfo = unitData.products;
            
            switch(true)
            {
                case url_type === '00' || status === 'cancelled':
                    userInvoices[Object.keys(userInvoices)[i]].status = 'failed';
                    info = 'failed';
                    url_type = '00'
                break;
                case url_type === '05' || status === 'completed':
                    userInvoices[Object.keys(userInvoices)[i]].status = 'success';
                    info = 'success';
                    url_type = '05'
                break;
                default:
                    userInvoices[Object.keys(userInvoices)[i]].status = 'unauthorised';
                    info = 'unauthorised'
            }
            userInvoices[Object.keys(userInvoices)[i]].receiptUrl = `${process.env.serverUrl}/redirect/?type=${url_type}&id=${url_inv_id}&status=null`

            break;
        }
    }
    await writeUserInvoice({data:userInvoices});

    switch(match)
    {
        case true:
            const convertObject_to_string = () =>{
                let string = [];
                productsInfo.forEach(val =>{
                    let unitInfo = ``

                    for(let i = 0; i < Object.keys(productsData).length; i++)
                    {
                        const unitProductData = productsData[Object.keys(productsData)[i]];

                        if(`${Object.keys(productsData)[i].slice(0,10)}P${unitProductData.itemId}` === val[0])
                        {
                            unitInfo = `${unitProductData.name}--${unitProductData.price_no}--${val[1]}`
                            break;
                        }
                    }
                    string.push(unitInfo)
                })
                return string.join('|');
            }
            res.render(
                path.join(__dirname, `/static/mainApp/redirect/redirect.ejs`),{
                    webMode:'',
                    cart:'',
                    info:info,
                    txId:url_inv_id,
                    customerInfo:`${customerInfo[0]} ${customerInfo[1]}`,
                    productsInfo:convertObject_to_string()
                }
            )
    }
})

app.post('/checkout',urlencoded,(req,res) =>{
    res.render(path.join(__dirname, `/static/mainApp/checkOut/checkout.ejs`),{
        webMode:req.body.webMode,
        cart:req.body.cartInfo
    })
})

app.post('/',urlencoded,(req,res) =>{
    console.log(req.body)
    res.render(
        path.join(__dirname,'static/mainApp/mainHtmlApp.ejs'),
        {
            webMode:req.body.webMode,
            cart:req.body.cartInfo
        }
    )
})

app.get('/admin-JETComputers',(req,res) =>{
    res.render(path.join(__dirname,'static/mainApp/admin-receipt/admin-re.ejs'),{webMode:'',cart:''})
})

app.get('/image',(req,res) =>{
    const images = fs.readdirSync(path.join(__dirname, `/static/mainApp/assets`));
    let imageName = 'def_pc.png'
    for(let i = 0; i < images.length; i++)
    {
        if(images[i].includes(req.query.icon))
            {
                imageName = images[i]
                break;
            }
    }
    res.sendFile(path.join(__dirname, `/static/mainApp/assets/${imageName}`))
})

server.listen(process.env.PORT, () =>{
    console.log(`server is listening at port ${process.env.PORT}`)
})

// app.listen(process.env.PORT, () =>{
//     console.log(`server is listening at port ${process.env.PORT}`)
// })


wss.on('connection', ws =>{ 
    ws.on('message', async(data) =>{

        const refined = JSON.parse(data)
        if(refined.header === 'visualTree')
        {
            Tree.tree = refined.data;
            if(Tree.connection !== null)
            {
                Tree.connection.send(JSON.stringify({header:'treeData', data:Tree.tree}))
            }
        }else if(refined.header === 'requestTree'){
            Tree.connection = ws
            ws.send(JSON.stringify({header:'treeData', data:Tree.tree}))
        }

        const parsed = JSON.parse(data.toString());
        switch(parsed.post)
        {
            case 'server':
                switch(parsed.type)
                {
                    case 'init-req':
                        get_send_init_data(parsed.msg.F1,ws)
                    break;
                    case 'update-cart':
                        get_send_cart_update(parsed.msg,ws)
                    break;
                    case 'apply-filter':
                        applyFilter_send(parsed.msg,ws);
                    break;
                    case 'checkout-invoice':
                        await createUserInvoice_save(parsed.msg)
                        .then((invoice_id) =>{
                            commence_check_out(parsed.msg,ws,invoice_id)
                        })
                        .catch(err =>{
                            console.log(err.message)
                        })
                    break;
                    case 'admin-reciept':
                        const userInvoices = await readData_userInvoice();
                        const sendData = [];
                        Object.keys(userInvoices).forEach(val =>{
                            const obj = {};
                            obj.name = `${userInvoices[val].firstName} ${userInvoices[val].lastName}`;
                            obj.link = userInvoices[val].receiptUrl;

                            sendData.push(obj)
                        })

                        ws.send(JSON.stringify({type:'reciept',msg:sendData}))
                }
        }
    })
})


async function get_send_init_data(filter,connection)
{
    const product_info = await readData();

    const userReturnArray = new Array()
    
    for(let i = 0 ; i < Object.keys(product_info).length; i++)
    {
        const unitData = product_info[Object.keys(product_info)[i]]

        switch(unitData.type)
        {
            case filter:
                const uniqueID = `${Object.keys(product_info)[i].slice(0,10)}P${unitData.itemId}`
                userReturnArray.push(
                    {
                        id:uniqueID,
                        ...{
                            name:unitData.name === undefined ? '' : unitData.name,
                            cpu:unitData.processor === undefined ? '' : unitData.processor,
                            ram:unitData.ram === undefined ? '' : unitData.ram,
                            gen:unitData.generation === undefined ? '' : unitData.generation,
                            size:unitData.size_no === undefined ? '' : unitData.size_no,
                            price:unitData.price_no === undefined ? '' : unitData.price_no,
                            info:unitData.moreInfo === undefined ? '' : unitData.moreInfo
                        }
                    }
                )
        }
    }

    // console.log(userReturnArray)
    connection.send(
        JSON.stringify(
            new clientPackage({type:'init-req',msg:userReturnArray})
        )
    )
}

async function get_send_cart_update(data,connection)
{
    const product_info = await readData();

    const userReturnArray = new Array();

    data.forEach(val =>{
        for(let i = 0 ; i < Object.keys(product_info).length; i++)
        {
            const unitData = product_info[Object.keys(product_info)[i]];
            const uniqueID = `${Object.keys(product_info)[i].slice(0,10)}P${unitData.itemId}`

            if(uniqueID === val.split('[')[0])
            {
                userReturnArray.push(
                    {
                        id:uniqueID,
                        ...{
                            name:unitData.name === undefined ? '' : unitData.name,
                            cpu:unitData.processor === undefined ? '' : unitData.processor,
                            ram:unitData.ram === undefined ? '' : unitData.ram,
                            gen:unitData.generation === undefined ? '' : unitData.generation,
                            size:unitData.size_no === undefined ? '' : unitData.size_no,
                            price:unitData.price_no === undefined ? '' : unitData.price_no,
                            info:unitData.moreInfo === undefined ? '' : unitData.moreInfo,
                            count:Number(val.split('[')[1].split(']')[0])
                        }
                    }
                );
                break;
            }
        }
    })

    // console.log(userReturnArray);
    connection.send(
        JSON.stringify(
            new clientPackage({type:'update-cart',msg:userReturnArray})
        )
    )
}

async function applyFilter_send(msg,connection)
{
    const product_info = await readData();

    const userReturnArray = new Array();

    for(let i = 0 ; i < Object.keys(product_info).length; i++)
    {
        const unitData = product_info[Object.keys(product_info)[i]];
        const uniqueID = `${Object.keys(product_info)[i].slice(0,10)}P${unitData.itemId}`;
        let bool = []
        
        for(let j = 0; j < Object.keys(msg).length;j++)
        {
            const unitFilter = msg[Object.keys(msg)[j]];
            let filterName = Object.keys(msg)[j] === 'size' ? 'size_no' : Object.keys(msg)[j];
            filterName = filterName === 'price' ? 'price_no' : filterName;
            filterName = filterName === 'category' ? 'type' : filterName;

            switch(filterName)
            {
                case 'size_no':
                    bool.push(unitData[filterName] >= unitFilter[0] && unitData[filterName] <= unitFilter[1])
                break;
                case 'price_no':
                    bool.push(unitData[filterName] >= unitFilter[0] && unitData[filterName] <= unitFilter[1])
                break;
                case 'type':
                    bool.push(unitData[filterName].toLowerCase() === unitFilter.toLowerCase())
            }
        }
        bool.every(val =>{return val === true}) ? userReturnArray.push(
            {
                id:uniqueID,
                ...{
                    name:unitData.name === undefined ? '' : unitData.name,
                    cpu:unitData.processor === undefined ? '' : unitData.processor,
                    ram:unitData.ram === undefined ? '' : unitData.ram,
                    gen:unitData.generation === undefined ? '' : unitData.generation,
                    size:unitData.size_no === undefined ? '' : unitData.size_no,
                    price:unitData.price_no === undefined ? '' : unitData.price_no,
                    info:unitData.moreInfo === undefined ? '' : unitData.moreInfo
                }
            }
        ) : ''
    }

    connection.send(
        JSON.stringify(
            new clientPackage({type:'init-req',msg:userReturnArray})
        )
    )
}

async function createUserInvoice_save(message)
{
    const userInfo = message.contactInfo;
    const inv_id = uuidv4();

    userInfo.invoice_id = inv_id;

    const readData = await readData_userInvoice();
    readData[inv_id] = new userInvoiceSchema(userInfo);
    readData[inv_id].products = message.invoice;
    readData[inv_id].receiptUrl = ''

    await writeUserInvoice({data:readData});

    return inv_id
}

async function commence_check_out(message,connection,invoice_id)
{   
    const product_info = await readData();

    const construct_url_id = `invoice-${invoice_id.slice(0,10)}-id`

    const getProductData = () =>{
        const returned = [];
        message.invoice.forEach(val =>{

        const object_template = {
            price_data:{
                currency:'ngn',
                product_data:{
                    name:''
                },
                unit_amount:0
            },
            quantity:0
        }

        for(let i = 0; i < Object.keys(product_info).length; i++)
            {

                const unitData = product_info[`${Object.keys(product_info)[i]}`]

                const uniqueID = `${Object.keys(product_info)[i].slice(0,10)}P${unitData.itemId}`;

                if(uniqueID === val[0])
                    {
                        object_template.price_data.product_data.name = unitData.name;
                        object_template.price_data.unit_amount = Number(`${unitData.price_no}`);
                        object_template.quantity = val[1];
                        returned.push(object_template)
                        break
                    }
            }
        })
        return returned
    }

    const genFlutterWaveInfo = () =>{
        let returned = [];
        message.invoice.forEach(val =>{
            const obj = {};
            for(let i = 0; i < Object.keys(product_info).length; i++)
                {
                    const unitData = product_info[`${Object.keys(product_info)[i]}`];
                    const uniqueID = `${Object.keys(product_info)[i].slice(0,10)}P${unitData.itemId}`;
        
                    if(uniqueID === val[0])
                    {
                        obj.amount = Number(unitData.price_no * val[1])
                    }
                }

            returned.push(obj)
        })
    return returned
    }
    
    // await stripe.checkout.sessions.create({
    //     payment_method_types:['card'],
    //     mode:'payment',
    //     line_items:getProductData(),
    //     success_url:`${process.env.serverUrl}/redirect?type=05&id=${construct_url_id}`,
    //     cancel_url:`${process.env.serverUrl}/redirect?type=00&id=${construct_url_id}`
    // }).catch(err =>{
    //     console.log(err.message)
    // })
    // .then((session) =>{
    //     switch(true)
    //     {
    //         case session !== undefined:
    //             connection.send(
    //                 JSON.stringify(
    //                     new clientPackage({type:'checkout-invoice',msg:session.url})
    //                 )
    //             )
    //         break;
    //         default:
    //             console.log('cannot obtain checkout session')
    //     }
    // })

    let totalAmount = 0;
    genFlutterWaveInfo().forEach(val =>{
        totalAmount += val.amount
    })
    
    switch(true)
    {
        case message.pay_type === 'transfer':
            totalAmount += 2050;
        break;
        default:
            totalAmount += 0.038 * totalAmount
    }

    const paymentData = {
        tx_ref: construct_url_id,
        amount:totalAmount,
        currency:'ngn',
        redirect_url: `${process.env.serverUrl}/redirect?type=05&id=${construct_url_id}`, // Replace with your callback URL
        payment_options: message.pay_type === 'transfer' ? 'banktransfer' : 'card', // Payment options: card, banktransfer, ussd, mobilemoney, qr, mpesa
        customer: {
            email:message.contactInfo.ename
        },
        customizations: {
            title: 'JET COMPUTERS',
            description: 'Payment for items in cart',
        },
    };

    console.log(paymentData)

    const response = await axios.post('https://api.flutterwave.com/v3/payments', paymentData, {
        headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
    })
    .catch(err =>{
        console.log(err.name);
        console.log(err.message)
    })
    .then(({data}) =>{
        connection.send(
            JSON.stringify(
                new clientPackage({type:'checkout-invoice',msg:data.data.link})
            )
    )
    })
    
}