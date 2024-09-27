require('dotenv').config();
const multer = require('multer')
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
const axios = require('axios');
const {initializeApp  , cert} = require('firebase-admin/app')
const {getFirestore , doc , setDoc, FieldValue} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');
const {ref , uploadBytesResumable} = require('firebase/storage')
const storageVar = multer.memoryStorage();
const uploadStorageVar = multer({storage:storageVar});
const serviceKey = require('./servicekey.json');
const { gzip } = require('zlib');
class clientPackage{
    constructor({type,msg})
    {
        this.post = 'client';
        this.type = type;
        this.msg = msg
    }
}
let intialiseApp , fireStoreDB , bucket;

//firebase codebase

const firebaseConfig = {
    apiKey:process.env.apiKey,
    authDomain:process.env.authDomain,
    projectId:process.env.projectId,
    storageBucket:process.env.storageBucket,
    messagingSenderId:process.env.messagingSenderId,
    appId:process.env.appId,
    measurementId:process.env.measurementId
}

const fireBaseinitialiser = async () =>{
    try{
        intialiseApp = await initializeApp({
            credential:cert(serviceKey),
            storageBucket:'gs://jet-computers.appspot.com'
        });
        fireStoreDB = getFirestore();
        bucket = getStorage().bucket();

        // createDoc()
        console.log('firestore intialised successfull')
    }catch(err)
    {
        console.log('could not connect to firestore')
    }

}
fireBaseinitialiser()

const createDoc = async () =>
{
    try{
        const data = fs.readFileSync('./newData.json').toString();
        const data_brands = fs.readFileSync('./brand.json').toString();

        const collection = fireStoreDB.collection('brands_folder').doc('brand');

        const uploadedData = await collection.set({data:JSON.parse(data_brands)})
        
        // const uploadedData = await collection.update({data:FieldValue.delete()})
        // deleting data here

        // const uploadedData = await collection.set({data:JSON.parse(data_brands)})
        //adding data here


        console.log('data uploaded')
    }catch(err)
    {
        console.log(err.message)
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

const readData_firebase = async () =>
{
    const collection = fireStoreDB.collection('products').doc('products');
    const docs = await collection.get();

    return docs.data().data
}

const write_MainData = async ({data}) =>{
    const writable = await fs.writeFileSync('./newData.json',JSON.stringify(data))
    // .then(() =>{
        console.log('write data successfull')
    // })
}

const write_mainData_firebase = async ({data}) =>
{
    const collection = fireStoreDB.collection('products').doc('products');

    const uploadedData = await collection.set({data:data})
}



const readData_JetBrands = async () =>{
    const data = await fs.readFileSync('./brand.json');

    return JSON.parse(data.toString())
}

const readData_JetBrands_firebase = async () =>
{
    const collection = fireStoreDB.collection('brands_folder').doc('brand');
    const docs = await collection.get();

    return docs.data().data
}

const write_JetBrands = async ({data}) =>{
    const writable = await fs.writeFileSync('./brand.json',JSON.stringify(data))
    // .then(() =>{
        console.log('write data successfull')
    // })
}

const write_JetBrands_firebase = async ({data}) =>
{
    const collection = fireStoreDB.collection('brands_folder').doc('brand');

    const uploadedData = await collection.set({data:data})
}



const readData_userInvoice = async () =>{
    const data = await fs.readFileSync('./userInvoice.json');

    return JSON.parse(data.toString())
}

const readData_userInvoice_firebase = async() =>
{
    const collection = fireStoreDB.collection('invoice_folder').doc('invoice');
    const docs = await collection.get();

    return docs.data().data
}

const writeUserInvoice = async ({data}) =>{
    const writable = await fs.writeFileSync('./userInvoice.json',JSON.stringify(data))
    // .then(() =>{
        console.log('write data successfull')
    // })
}

const writeUserInvoice_firebase = async({data}) =>
{
    const collection = fireStoreDB.collection('invoice_folder').doc('invoice');

    const uploadedData = await collection.set({data:data})
}



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'static/mainApp/admin-receipt')))
app.use(express.static(path.join(__dirname,'static/mainApp/redirect')))
app.use(express.static(path.join(__dirname,'static/mainApp/checkOut')))
app.use(express.static(path.join(__dirname,'static/mainApp')))
app.use(express.static(path.join(__dirname,'static/adminPage')))
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

app.get('/admin_edit_page',(req,res) =>{
    res.sendFile(path.join(__dirname,`./static/adminPage/adminPage.html`));
})

app.post('/upload_product_image' ,urlencoded , uploadStorageVar.single('file') , async (req,res) =>{    
    if(req.file)
    {
        const metaData = {
            metaData:{
                firebaseStorageDownloadTokens:req.body.fileName
            },
            contentType:req.file.mimetype,

        }

        console.log('came here init 1')

        const timeRand = new Date().getTime()
        const blob = bucket.file(`${req.body.productID}-${timeRand}.${req.file.originalname.split('.')[1]}`);
        const blobStream = blob.createWriteStream({
            metaData:metaData,
            gzip:true
        })

        // console.log(blobStream)

        blobStream.on('error' , err =>{
            console.log(err)
        })

        blobStream.on('finish' , async (data) =>{
            console.log('image uploaded successfully');
            await blob.makePublic();
            const imageURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            //add image path to the product object
            const productData = await readData_firebase();
            if(Object.keys(productData).includes(req.body.productID))
            {
                productData[req.body.productID].productImg = imageURL;
                write_mainData_firebase({data:productData})

                res.status(200).json({data:'Image uploaded successfully' , imageURL:imageURL , productID:req.body.productID});

                console.log('addded product img successfully ')
            }
        })

        blobStream.end(req.file.buffer)
    }
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
    const productsData = await readData_firebase();
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
                    break;
                    case 'admin_brand_req':{
                        let data_brands = await readData_JetBrands_firebase()
                        ws.send(JSON.stringify({
                            data:data_brands,
                            type:'admin_brand'
                        }));
                    }
                    break;
                    case 'init_jet_brands_req':
                        let data_brands = await readData_JetBrands_firebase()
                        ws.send(JSON.stringify({
                            data:data_brands,
                            post:'client',
                            type:'init_jet_brands'
                        }));
                        break;
                    case 'add_admin_brand':
                        let data_brands_add = await readData_JetBrands_firebase()
                        data_brands_add.push(parsed.data.toLowerCase());
                        write_JetBrands_firebase({data:data_brands_add});

                        ws.send(JSON.stringify({
                            data:data_brands_add,
                            type:'admin_brand_add'
                        }));
                    break;
                    case 'edit_admin_brand':{
                        let data_brands_edit = await readData_JetBrands_firebase();
                        const product_data = await readData_firebase();


                        if(data_brands_edit.indexOf(parsed.msg.prevName) !== -1)
                        {
                            //stage 1 operation start

                            data_brands_edit[data_brands_edit.indexOf(parsed.msg.prevName)] = parsed.msg.newName.toLowerCase();
                            write_JetBrands_firebase({data:data_brands_edit});

                            Object.keys(product_data).forEach(val =>{
                                if(product_data[val].type.toLowerCase() === parsed.msg.prevName.toLowerCase())
                                {
                                    product_data[val].type = parsed.msg.newName.toLowerCase()
                                }
                            })

                            //stage 1 operation end

                            //stage 2 operation start

                            // console.log(readData())

                            //stage 2 operation start

                            write_mainData_firebase({data:product_data})

                            ws.send(JSON.stringify({
                                data:data_brands_edit,
                                type:'admin_brand_edit'
                            }));
                        }else{
                            console.log('invalid brand name')
                        }
                    }
                    break;
                    case 'delete_admin_brand':
                        let data_brands_del = await readData_JetBrands_firebase();
                        const product_data = await readData_firebase();
                        const faultyProductId = []

                        // console.log(parsed.msg.brandName)
                        // console.log(data_brands_del)

                        if(data_brands_del.indexOf(parsed.msg.brandName) !== -1)
                        {
                            data_brands_del.splice(data_brands_del.indexOf(parsed.msg.brandName),1);

                            write_JetBrands_firebase({data:data_brands_del});

                            Object.keys(product_data).forEach(val =>{
                                if(product_data[val].type.toLowerCase() === parsed.msg.brandName.toLowerCase())
                                {
                                    faultyProductId.push(val)
                                }
                            })

                            faultyProductId.forEach(val =>{
                                delete product_data[val];
                            })

                            write_mainData_firebase({data:product_data})

                            ws.send(JSON.stringify({
                                data:data_brands_del,
                                type:'admin_brand_del'
                            }));
                        }else{
                            console.log('invalid brand name')
                        }
                    break;
                    case 'admin_product_req':
                        const data = await readData_firebase();
                        const parcel = new Array()

                        for(let i = 0; i < Object.keys(data).length; i++)
                        {
                            const instanceData = data[Object.keys(data)[i]];
                            if(instanceData.type.toLowerCase() === parsed.brand.toLowerCase())
                            {
                                instanceData.productID = Object.keys(data)[i];
                                parcel.push(instanceData)
                            }
                        }

                        ws.send(JSON.stringify({
                            type:'admin_product_delivery',
                            parcel:parcel
                        }));
                    break;
                    case 'add_admin_product_getID':
                        ws.send(JSON.stringify({
                            type:'add_admin_product_sendID',
                            productID:uuidv4()
                        }));
                    break;
                    case 'delete_admin_product_id':{
                        const data = await readData_firebase();
                        let feedback = false;
                        if(Object.keys(data).includes(parsed.productID))
                        {
                            delete data[parsed.productID]
                            feedback = true;
                        }else{
                            console.log('product ID not found')
                            feedback = false
                        }

                        write_mainData_firebase({data:data})
                        
                        ws.send(JSON.stringify({
                            type:'delete_admin_product_feedback',
                            status:feedback ? 'success' : 'fail'
                        }));
                    }
                    break;
                    case 'save_admin_product':
                        const updatedData = parsed.parcel;
                        const existingData = await readData_firebase();
                        let existingData_size = Object.keys(existingData).length

                        updatedData.forEach(val =>{
                            if(Object.keys(existingData).includes(val.productID))
                            {
                                existingData[val.productID] = val
                            }else{
                                existingData_size++;
                                val.itemId = existingData_size;
                                existingData[val.productID] = val
                            }
                            
                        })

                        try{
                            write_mainData_firebase({data:existingData})

                            ws.send(JSON.stringify({
                                type:'save_admin_product_res',
                                status:'success'
                            }));
                        }catch(err)
                        {
                            console.log(err.message)

                            ws.send(JSON.stringify({
                                type:'save_admin_product_res',
                                status:'fail'
                            }));
                        }
                    }
        }
    })
})


async function get_send_init_data(filter,connection)
{
    const product_info = await readData_firebase();

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
                            info:unitData.moreInfo === undefined ? '' : unitData.moreInfo,
                            productImg:unitData.productImg === undefined ? '' : unitData.productImg,
                            avail:unitData.copies === undefined ? '' : unitData.copies,
                            useType:unitData.useCase === undefined ? '' : unitData.useCase,

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
    const product_info = await readData_firebase();

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
                            productImg:unitData.productImg === undefined ? '' : unitData.productImg,
                            avail:unitData.copies === undefined ? '' : unitData.copies,
                            useType:unitData.useCase === undefined ? '' : unitData.useCase,
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
    const product_info = await readData_firebase();

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
                    info:unitData.moreInfo === undefined ? '' : unitData.moreInfo,
                    productImg:unitData.productImg === undefined ? '' : unitData.productImg,
                    avail:unitData.copies === undefined ? '' : unitData.copies,
                    useType:unitData.useCase === undefined ? '' : unitData.useCase,
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
    const product_info = await readData_firebase();

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