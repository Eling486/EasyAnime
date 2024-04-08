const subgroup = {
    SUPPORTED: ['GJ.Y', 'ANi', '桜都字幕组', '喵萌奶茶屋&LoliHouse', '猎户压制部', '梦蓝字幕组', 'LoliHouse'],
    DETAIL_KEYWORD: {
        video: ['AVC', 'HEVC'],
        audio: ['AAC'],
        format: ['MP4', 'MKV'],
        dpi: {
            '4K': ['4K', '3840x2160'],
            '1080P': ['1080P', '1920x1080'],
            '720P': ['720P']
        },
        subtitle: {
            'CHT': ['CHT', '繁'],
            'CHS': ['CHS', '简', '簡'],
            'JP': ['JP', '日']
        },
        coding: ['BIG5', 'GB', '10Bit']
    },
    format: (title) => {
        if (!title) return null;
        let src = title
        let season = 1
        
        title = title.replace(/【/g, '[')
        title = title.replace(/】/g, ']')
        title = title.replace(/(.*)★(.*)★(.*)/, "$1[$2]$3")
        title = title.replace(/\[.[^\[]*?新番\]/g, '')
        title = title.replace(/\D+合集/g, '')
        title = title.replace(/\[\S+\]( - \d+)/g, '$1')
        title = title.replace(/ 第(.*)[话集] /g, '[$1]')
        title = title.replace(/\[第(.*)话\]/g, '[$1]')
        title = title.replace(/\[\[(.*)\]\]/g, '[$1]')

        title = title.replace(/(\[.*?\]) (.*) 第(.*)[话集] *(.*)/, "$1 {$2} <$3> [$4]")

        // [subgroup][name]...[ep]... -> [subgroup] {name} [ep] ...
        title = title.replace(/(\[.*?\]) *\[(.*?)\] *\[(\d+.?\d+)\](.*)/, "$1 {$2} <$3> $4")
        // [subgroup]name[...] - ep ... -> [subgroup] {name} [ep] ...
        title = title.replace(/(\[.*\]) *\[?(.*)\]? *\[?.*\]? - (\d+.?\d+) (.*)/, "$1 {$2} <$3> $4")
        // [subgroup]name[ep]... -> [subgroup] {name} [ep]...
        title = title.replace(/(\[.*?\]) *([^\{]*?[^\}]) *\[(\d+.?\d+)\](.*)/, "$1 {$2} <$3>$4")
        title = title.replace(/(.*)\{(.*)\]\[(.*)\}(.*)/, "$1{$2 / $3}$4")
        title = title.replace(/(.*)\{(.*)_(.*)\}(.*)/, "$1{$2 / $3}$4")
        if (title == src) {
            title = title.replace(/(\[.*?\]) *\[?(.*?)\]? *(\[.*\])/, "$1 {$2} <> $3")
            if(!/\[(.*)\].*\{(.*)\}.*\<(.*)\>(.*)/.test(title)){
                title = title.replace(/(\[.*?\]) *\[(.*?)\] *(.*)/, "$1 {$2} <> $3")
            }
            season = null
        }
        let info = title.match(/\[(.*)\].*\{(.*)\}.*\<(.*)\>(.*)/)
        let subgroup, name, ep, details = null
        if (!info) {
            return {
                src: src,
                formatted: title,
                info: []
            }
        }
        if (info[1]) {
            subgroup = info[1].replace(/\]\[/, '&')
            subgroup = subgroup.split('&')
        }
        if (info[2]) {
            nameList = info[2].split('/')
            for (let i = 0; i < nameList.length; i++){
                if(/.*[\u4e00-\u9fa5]+.*$/.test(nameList[i])){
                    name = nameList[i]
                }
            }
            if(!name){
                name = nameList[0]
            }
            let seasonListCN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
            let resultSeasonCN = null//name.match(/第(.)季/) || name.match(/第(.)幕/)
            let resultSeasonEN = name.match(/Season (\d+)/) || name.match(/ S(\d+)/)
            let resultSeason = resultSeasonCN || resultSeasonEN
            if (resultSeason) {
                let floatResult = parseFloat(resultSeason[1])
                if(!isNaN(floatResult)){
                    season = floatResult
                }
                if(seasonListCN.indexOf(resultSeason[1]) >= 0){
                    season = seasonListCN.indexOf(resultSeason[1])
                }
                name = name.replace(/第.季/g, '')
                name = name.replace(/第.幕/g, '')
                name = name.replace(/Season \d+/g, '')
                name = name.replace(/ S(\d+)/g, '')
            }
            name = name.trimEnd()
        }
        ep = info[3]

        let type = 'single'
        if(ep.indexOf('-') > 0) type = 'collection';

        if(!isNaN(parseFloat(ep)) && type == 'single'){
            ep = parseFloat(ep)
        }
        if(!ep){
            ep = null
        }
        if (info[4]) {
            details = info[4].match(/(\[)(.*?)(\])/g)
            if (!details) {
                details = info[4].replace(/\((.*?)\)/g, '$1')
                if (details) {
                    details = details.split(' ')
                    details = details.filter(function (el) {
                        return el && el.trim();
                    });
                }
            }
        }

        let result = {
            type: type,
            src: src,
            formatted: title,
            info: {
                subgroup,
                name,
                season,
                ep,
                details
            }
        }
        return result
    },
    getSubgroup: (title) => {
        title = subgroup.format(title)
        let result = title.match(/\[(.*?)\]/)
        let subgroupName = null
        if (result) {
            subgroupName = result[1]
        }
        return subgroupName
    }
}

module.exports = subgroup;