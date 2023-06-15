const axios = require('axios')
const cheerio = require('cheerio')
const KCAR = "http://api.encar.com/search/car/list/premium?count=true&q=(And.Hidden.N._.(C.CarType.Y._.(C.Manufacturer.%ED%98%84%EB%8C%80._.(C.ModelGroup.%EC%95%84%EB%B0%98%EB%96%BC._.(C.Model.%EC%95%84%EB%B0%98%EB%96%BC+AD._.BadgeGroup.LPG+1600cc.))))_.Price.range(..1000).)&sr=%7CModifiedDate%7C0%7C20"
const KCAR_DETAIL = "http://www.encar.com/dc/dc_cardetailview.do?method=kidiFirstPop&carid=34799503&wtClick_carview=044"

const main = async()=>{ 
    const opt = { 
        method: 'GET',
        url: KCAR,  
        responseEncoding: 'utf8'
    }
    const ret = await axios.request(opt)
    const id_list = ret.data.SearchResults.map(e => {
        const a = "http://www.encar.com/dc/dc_cardetailview.do?method=kidiFirstPop&carid="+ e.Id + "&wtClick_carview=044"  
        return a
    })  
    const id_list2 = ret.data.SearchResults.map(e => ({
        Id : e.Id, 
        name : e.Model + " " + e.Badge + " / " + e.FormYear + " / " + e.Price + '만원' 
    }))
    const r = await Promise.all(id_list.map(url => axios.get(url))).catch((error) => {
        console.error(error.message);
    });   
    let a = []
    for(let i = 0; i < id_list2.length; i++){
        const ret2 = r[i]
        const html = ret2.data;  
        const url = ret2.config.url  
        const $ = cheerio.load(html);   
        const t = $('div.smlist table tbody td') 
        const s = $(t[5]).text().split("/")[1]
        if(!s) continue; 
        if(s.includes("0") || s.includes("1")){  
            const b = 'http://www.encar.com/dc/dc_cardetailview.do?pageid=dc_carsearch&listAdvType=normal&carid=' + id_list2[i].Id + '&view_type=checked&adv_attribute=&wtClick_korList=019&advClickPosition=kor_normal_p2_g1&tempht_arg=woQY13u8U6B9_0'
            a.push({
                id : b, 
                name : id_list2[i].name
            })
        }   
    }  
    console.log(a)
}   
 
main() 
