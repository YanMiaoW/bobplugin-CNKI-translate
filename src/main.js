

function supportLanguages() {
    return ['auto', 'en', 'zh-Hans'];
}

async function translateAPI(originText) {

    try {

        const urlK = "http://www.pengxingxiang.com/EnglishEncode"

        const respK = await $http.request({
            url: urlK,
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: {
                text: originText
            }
        });

        const word = respK.data.eText

        const url = "https://dict.cnki.net/fyzs-front-api/translate/literaltranslation"

        const raw = `{\"words\":\"${word}",\"translateType\":null}`

        const resp = await $http.request({
            url,
            method: "POST",
            header: {
                "Content-Type": "application/json;charset=UTF-8",
                "Token": "2011beb6-92a3-47be-9ea4-483a02cfd6ba",
            },
            body: $data.fromUTF8(raw),
            redirect: 'follow'
        });

        const data = resp.data.data?.mResult

        if (data) {
            return [data]

        } else {

            return null
        }


    } catch (error) {

        return null
    }

}

function translate(query, completion) {

    try {
        translateAPI(query.text).then(resultOut => {

            if (resultOut != null) {

                completion({
                    result: {
                        toParagraphs: resultOut,
                    }
                });
            } else {

                completion({
                    error: {
                        type: "notFound",
                        message: "不支持翻译",
                    }
                });
            }
        })

    } catch (error) {

        completion({
            error: {
                type: "notFound",
                message: "不支持翻译",
            }
        });
    }

}
