const fs = require('fs');
const {v4:uuidv4} = require('uuid')

const data = fs.readFileSync('./mainData.txt');

const selectType = ['HP','Dell','Acer','Lenovo','Apple'];
const setDataLabels = [['processor','c: '],['ram','r: '],['generation','g: '],['size','s: '],['moreInfo','e: '],['price','p: ']]

const jsonRefinedData = {

}

const dataArray = data.toString().split('\r\n\r\n')
for(let i = 0; i < dataArray.length; i++)
    {
        const perPack = dataArray[i].split('\r\n');
        const uID = uuidv4();
        jsonRefinedData[`${uID}`] = {}
        jsonRefinedData[`${uID}`].itemId = i + 1;
        jsonRefinedData[`${uID}`].img = ""
        for(let j = 0; j < perPack.length; j++)
        {
            switch(j)
            {
                case 0:
                    jsonRefinedData[`${uID}`].name = perPack[j].slice(3);
            
                    for(let k = 0; k < selectType.length; k++)
                        {
                            if(perPack[j].slice(3).includes(selectType[k]))
                                {
                                    jsonRefinedData[`${uID}`].type = selectType[k].toLowerCase()
                                    break;
                                }
                        }
                break;
                default:
                    for(let m = 0; m < setDataLabels.length; m++)
                    {
                        const current = setDataLabels[m];
                        const test = new RegExp(`^\\s{0,}${current[1]}`)
                        if(test.test(perPack[j]))
                            {
                                jsonRefinedData[`${uID}`][`${current[0]}`] = perPack[j].split(' - ')[1];
                                switch(true)
                                {
                                    case current[0] === 'size':
                                        jsonRefinedData[`${uID}`]['size_no'] = Number(/\d{1,}\.{0,}\d{0,}/.exec(perPack[j])[0])
                                }

                                switch(true)
                                {
                                    case current[0] === 'price':
                                        jsonRefinedData[`${uID}`]['price_no'] = Number(/\d{2,}\,{0,}\d{3,}/.exec(perPack[j])[0].split(',').join(''))
                                }
                                break
                            }
                    }
            }
        }
        
    }

    const writeSaveData = fs.writeFileSync('./newData.json',JSON.stringify(jsonRefinedData))