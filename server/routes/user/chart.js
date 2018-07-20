/*
 * 유저 차트을 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */

//챠트 가져오기
var getUserChartList = function(req, res) {
    console.log('/user/chart/getChartList 호출됨.');

    var indate = req.body.indate;
    var gubun1 = req.body.gubun1; // 표기 방식
    var gubun2 = req.body.gubun2; // 대분류
    var gubun3 = req.body.gubun3; // 중분류
    var gubun4 = req.body.gubun4; // 회원사명
    var grpgubun = req.body.grpgubun; // 회원사명

    console.log("\n\nindate : " + indate);
    console.log("gubun1 : " + gubun1);
    console.log("gubun2 : " + gubun2);
    console.log("gubun3 : " + gubun3);
    console.log("gubun4 : " + gubun4);
    console.log("grpgubun : " + grpgubun);

    if (indate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    }

    var fs = require('fs');
    var rddir = "./public/Traffic/" + indate + "/";

    console.log("rddir:::" + rddir);

    fs.readdir(rddir, function(err, data) {
        var resBody = {};
        var resList = data;
        var dataList = [];

        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            resList = stocknetFilter(resList, gubun1, gubun2, gubun3, gubun4, grpgubun);

            if (resList.length != 1 || resList[0] != "NOAUTH") {
                resList.forEach(function(el, idx, array) {
                    var clist = {
                        'imgsrc': "",
                        'xlssrc': ""
                    };
                    // console.log("el : ", el);
                    clist.imgsrc = "/public/Traffic/" + indate + "/" + el;
                    el = el.replace("png", "csv");
                    el = el.replace("_0_", "_1_");
                    clist.xlssrc = "/public/Traffic_Excel/" + indate + "/" + el;
                    // console.log('테스트...png.........' + clist.imgsrc);
                    // console.log('테스트...csv.........' + clist.xlssrc);
                    // console.log('테스트...csv.........' + clist.xlssrc);
                    // console.log('테스트...el........' + el);
                    dataList.push(clist);
                });
                console.log('dataList' + dataList.clist)
                console.log('dataList.length:::' + dataList.length);
                // console.log('dataList.clist.xlssrc' + dataList.clist.xlssrc)
                if (dataList.length > 0) {
                    resBody = { "clist": dataList };
                    succSend(res, resBody);
                } else {
                    errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
                }
            } else {
                errSend(res, "해당 권한이 없습니다.");
            }
        }
    });

};

var downloadFile = function(req, res) {
    console.log('chart 모듈 안에 있는 downloadImage 호출됨.');

    var indate = req.body.indate;
    var gubun1 = req.body.gubun1; // 표기 방식
    var gubun2 = req.body.gubun2; // 대분류
    var gubun3 = req.body.gubun3; // 중분류
    var gubun4 = req.body.gubun4; // 회원사명
    var grpgubun = req.body.grpgubun; // 회원사명
    var filegubun = req.body.filegubun;


    console.log("\n\nindate : " + indate);
    console.log("gubun1 : " + gubun1);
    console.log("gubun2 : " + gubun2);
    console.log("gubun3 : " + gubun3);
    console.log("gubun4 : " + gubun4);
    console.log("grpgubun.route_gubun1 : " + grpgubun.route_gubun1);
    console.log("grpgubun : " + grpgubun);
    console.log("filegubun : " + filegubun);


    if (indate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    }

    var fs = require('fs');
    var JSZip = require('jszip');
    var rddir = "";
    var resBody = {};

    var zip = new JSZip();
    var outFileName = "";
    var fileCnt = 0;

    if (filegubun == "EXCEL") {
        rddir = "./public/Traffic_Excel/" + indate + "/";
        outFileName = "excel_" + indate + ".zip";
    } else {
        rddir = "./public/Traffic/" + indate + "/";
        outFileName = "image_" + indate + ".zip";
    }

    fs.readdir(rddir, function(err, data) {
        console.log('chart 모듈 안에 있는 downloadImage 호출됨.1');
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var resList = data;
            resList = stocknetFilter(resList, gubun1, gubun2, gubun3, gubun4, grpgubun);

            if (resList.length != 1 || resList[0] != "NOAUTH") {
                resList.forEach(function(el, idx, array) {
                    console.log(rddir + el);
                    var stream = fs.createReadStream(rddir + el);
                    zip.folder(indate).file(el, stream);
                    fileCnt += 1;
                });
                if (fileCnt > 0) {
                    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                        .pipe(fs.createWriteStream('./public/download/' + outFileName))
                        .on('finish', function() {
                            console.log('chart 모듈 안에 있는 downloadImage 호출됨.3');
                            resBody = { "filename": outFileName };
                            succSend(res, resBody);
                        });
                } else {
                    errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
                }
            } else {
                errSend(res, "해당 권한이 없습니다.");
            }
        }
    });
};

var filterArr = function(arr, str) {
    arr = arr.filter(function(val) {
        return val.indexOf(str) !== -1;
    });
    return arr;
}

var dateFilter = function(topList, sdate, edate) {
    var resList = [];
    topList.forEach(function(el, idx, array) {
        if (el >= sdate && el <= edate) {
            resList.push(el);
            console.log("el : " + el + " sdate : " + sdate + " edate : " + edate);
        }
    });

    return resList;
}

//일반회원 주문필터
var jumunFilter = function(resList, gubun3, gubun4, grpgubun) {

    var noAuth = ["NOAUTH"];
    var isval = 0;
    //gubun3 = 중분류 0:전체, 1:서울현물 , 2:서울파생 , 3:부산파생, 4:주문테스트
    if (gubun3 == 1) {
        resList = grpgubun.route_gubun1 ? filterArr(resList, "_SPOT_") : noAuth;
        console.log('주문 서울현물 _SPOT_ 검색')
    } else if (gubun3 == 2) {
        resList = grpgubun.route_gubun2 ? filterArr(resList, "_FUTURES_") : noAuth;
        console.log('주문 서울파생 _FUTURES_ 검색')
    } else if (gubun3 == 3) {
        resList = grpgubun.route_gubun3 ? filterArr(resList, "_FUTUREB_") : noAuth;
        console.log('주문 부산파생 _FUTUREB_ 검색')
    } else if (gubun3 == 4) {
        resList = grpgubun.route_gubun4 ? filterArr(resList, "_ORTEST_") : noAuth;
        console.log('주문 주문테스트 _ORTEST_ 검색')
    } else if (gubun3 == 0) {
        // 전체 조회
        var outList = [];
        if (grpgubun.route_gubun1) {
            outList = outList.concat(filterArr(resList, "_SPOT_"));
            isval = 1;
        }
        // console.log('전체 route_gubun1 :: ' + outList);
        if (grpgubun.route_gubun2) {
            outList = outList.concat(filterArr(resList, "_FUTURES_"));
            isval = 1;
        }
        // console.log('전체 route_gubun2 :: ' + outList);
        if (grpgubun.route_gubun3) {
            outList = outList.concat(filterArr(resList, "_FUTUREB_"));
            isval = 1;
        }
        // console.log('전체 route_gubun3 :: ' + outList);
        if (grpgubun.route_gubun4) {
            outList = outList.concat(filterArr(resList, "_ORTEST_"));
            isval = 1;
        }
        if (isval == 0) {
            outList = noAuth;
        }
        //console.log('전체 route_gubun4 :: ' + outList);
        resList = outList;
    }
    if (resList.length != 1 || resList[0] != "NOAUTH") resList = customFilter(resList, gubun4);
    return resList;
}

//일반회원 시세필터
var siseFilter = function(resList, gubun3, grpgubun) {
    var noAuth = ["NOAUTH"];
    var isval = 0;
    // gubun3 = 중분류 0:전체, 1:유가, 2:코스닥, 3:ELW, 4:채권, 5:지수옵션, 6:선물, 7:부산파생시세, 8:시세테스트,
    if (gubun3 == 1) {
        resList = grpgubun.market_gubun1 ? filterArr(resList, "_MD_YUGA_") : noAuth;
        console.log('시세 유가 _YUGA_ 검색')
    } else if (gubun3 == 2) {
        resList = grpgubun.market_gubun2 ? filterArr(resList, "_MD_KOSDAQ_") : noAuth;
        console.log('시세 코스닥 _KOSDAQ_ 검색')
    } else if (gubun3 == 3) {
        resList = grpgubun.market_gubun3 ? filterArr(resList, "_MD_ELW_") : noAuth;
        console.log('시세 ELW _ELW_ 검색')
    } else if (gubun3 == 4) {
        resList = grpgubun.market_gubun4 ? filterArr(resList, "_MD_BOND_") : noAuth;
        console.log('시세 채권 _BOND_ 검색')
    } else if (gubun3 == 5) {
        resList = grpgubun.market_gubun5 ? filterArr(resList, "_MD_OPT_") : noAuth;
        console.log('시세 지수옵션 _OPT_ 검색')
    } else if (gubun3 == 6) {
        resList = grpgubun.market_gubun6 ? filterArr(resList, "_MD_SUNMUL_") : noAuth;
        console.log('시세 선물 _SUNMUL_ 검색')
    } else if (gubun3 == 7) {
        resList = grpgubun.market_gubun7 ? filterArr(resList, "_MD_BS_") : noAuth;
        console.log('시세 부산파생시세 _MD_BS_ 검색')
    } else if (gubun3 == 8) {
        resList = grpgubun.market_gubun8 ? filterArr(resList, "_MDTEST_") : noAuth;
        console.log('시세 시세테스트 _MDTEST_ 검색')
    } else if (gubun3 == 0) {
        // 전체 조회  -> 시세 전체조회 (시세 + 시세테스트)= MD + MDTEST
        console.log('시세 전체 조회')
        var outList = [];
        // console.log('resList ::' + resList)
        if (grpgubun.market_gubun1) {
            outList = outList.concat(filterArr(resList, "_MD_YUGA_"));
            isval = 1;
        }
        if (grpgubun.market_gubun2) {
            outList = outList.concat(filterArr(resList, "_MD_KOSDAQ_"));
            isval = 1;
        }
        if (grpgubun.market_gubun3) {
            outList = outList.concat(filterArr(resList, "_MD_ELW_"));
            isval = 1;
        }
        if (grpgubun.market_gubun4) {
            outList = outList.concat(filterArr(resList, "_MD_BOND_"));
            isval = 1;
        }
        if (grpgubun.market_gubun5) {
            outList = outList.concat(filterArr(resList, "_MD_OPT_"));
            isval = 1;
        }
        if (grpgubun.market_gubun6) {
            outList = outList.concat(filterArr(resList, "_MD_SUNMUL_"));
            isval = 1;
        }
        if (grpgubun.market_gubun7) {
            outList = outList.concat(filterArr(resList, "_MD_BS_"));
            isval = 1;
        }
        if (grpgubun.market_gubun8) {
            outList = outList.concat(filterArr(resList, "_MDTEST_"));
            isval = 1;
        }
        if (isval == 0) {
            outList = noAuth;
        }
        //console.log('전체 market gubun :: ' + outList);
        resList = outList;
    }
    return resList;
}

//PB필터 권한 체크없음.
var pbFilter = function(resList, gubun3, gubun4) {
    // 중분류 gubun3 =  0:전체, 1:API, 2:BCP, 3:채권공시, 4:CTI, 5:그룹웨어, 6:HTS, 7:인터넷, 8:KOSMOS
    // 중분류 gubun3 = 9:MG, 10:MMF, 11:MTS, 12:NFS, 13:장외채권, 14:PB, 15:원장, 16:기타

    resList = filterArr(resList, "P_PB_"); //PB구분자 중에서........PB는 6/12일자만 있음
    var outList = [];

    if (gubun3 == 1) { //1:API,
        outList = outList.concat(filterArr(resList, "_API_"));
        outList = outList.concat(filterArr(resList, "_HAPI_"));
        outList = outList.concat(filterArr(resList, "_SAPI_"));
        outList = outList.concat(filterArr(resList, "_APIBCP_"));
        outList = outList.concat(filterArr(resList, "_APIDR_"));
        outList = outList.concat(filterArr(resList, "_APIDRTEST_"));
        outList = outList.concat(filterArr(resList, "_APITEST_"));
        console.log('PB _API_ 검색')
    } else if (gubun3 == 2) { //2:BCP
        outList = filterArr(resList, "_BCP_");
        console.log('PB _BCP_ 검색')
    } else if (gubun3 == 3) { //3:채권공시
        outList = filterArr(resList, "_BOND_");
        console.log('PB _BOND_ 검색')
    } else if (gubun3 == 4) { //4:CTI
        outList = filterArr(resList, "_CTI_");
        console.log('PB _CTI_ 검색')
    } else if (gubun3 == 5) { //5:그룹웨어
        outList = filterArr(resList, "_GW_");
        console.log('PB _GW_ 검색')
    } else if (gubun3 == 6) { //6:HTS
        outList = filterArr(resList, "_HTS_");
        console.log('PB _HTS_ 검색')
    } else if (gubun3 == 7) { //7:인터넷 INT
        outList = filterArr(resList, "_INT_");
        console.log('PB _INT_ 검색')
    } else if (gubun3 == 8) { //8:KOSMOS
        outList = outList.concat(filterArr(resList, "_KOSMOS_"));
        outList = outList.concat(filterArr(resList, "_KOSMOSDR_"));
        outList = outList.concat(filterArr(resList, "_KSTEST_"));
        console.log('PB _KOSMOS_ 검색')
    } else if (gubun3 == 9) { //9:MG
        outList = outList.concat(filterArr(resList, "_MG_"));
        outList = outList.concat(filterArr(resList, "_MGAPI_"));
        outList = outList.concat(filterArr(resList, "_MGBCP_"));
        outList = outList.concat(filterArr(resList, "_MGTEST_"));
        console.log('PB _MG_ 검색')
    } else if (gubun3 == 10) { //10:MMF
        outList = outList.concat(filterArr(resList, "_MMF_"));
        outList = outList.concat(filterArr(resList, "_MMFDR_"));
        console.log('PB _MMF_ 검색')
    } else if (gubun3 == 11) { //11:MTS
        outList = outList.concat(filterArr(resList, "_MTS_"));
        outList = outList.concat(filterArr(resList, "_MTSDF_"));
        console.log('PB _MTS_ 검색')
    } else if (gubun3 == 12) { //12:NFS
        outList = filterArr(resList, "_NFS_");
        console.log('PB _NFS_ 검색')
    } else if (gubun3 == 13) { //13:장외채권 
        outList = outList.concat(filterArr(resList, "_OTC_"));
        outList = outList.concat(filterArr(resList, "_OTCBCP_"));
        outList = outList.concat(filterArr(resList, "_OTCBOND_"));
        outList = outList.concat(filterArr(resList, "_OTCBONDFIMS_"));
        console.log('PB _장외채권_ 검색')
    } else if (gubun3 == 14) { //14:PB 
        outList = outList.concat(filterArr(resList, "_PB_M_"));
        outList = outList.concat(filterArr(resList, "_PB_B_"));
        outList = outList.concat(filterArr(resList, "_PBBCP_"));
        outList = outList.concat(filterArr(resList, "_PBDR_"));
        outList = outList.concat(filterArr(resList, "_PBTEST_"));
        console.log('PB _PB_ 검색')
    } else if (gubun3 == 15) { //15:원장
        outList = outList.concat(filterArr(resList, "_WJ_M_"));
        outList = outList.concat(filterArr(resList, "_WJ_B_"));
        outList = outList.concat(filterArr(resList, "_WJTEST_"));
        console.log('PB 원장 검색')
    } else if (gubun3 == 16) { //16:기타
        outList = outList.concat(filterArr(resList, "_L3_"));
        outList = outList.concat(filterArr(resList, "_TRUST_"));
        outList = outList.concat(filterArr(resList, "_OCIMSBCP_"));
        console.log('PB _기타_ 검색')
    } else {
        // PB 중분류 전체 조회
    }
    resList = outList;
    //회원필터
    resList = customFilter(resList, gubun4);

    return resList;
}


var stocknetFilter = function(resList, gubun1, gubun2, gubun3, gubun4, grpgubun) {

    // gubun1 = 표기방식 0:전체 , 1:회선사용량(bps) , 2:회선사용률(%)
    if (gubun1 == 1) {
        resList = filterArr(resList, "_1_");
        console.log('회선사용량으로 검색')
    } else if (gubun1 == 2) {
        resList = filterArr(resList, "_0_");
        console.log('회선사용률(%)로 검색')
    } else {
        // 전체 조회
    }
    // gubun2 = 대분류 0: 전체, 1: 주문 , 2: 시세 , 3: PB
    if (gubun2 == 1) {
        resList = jumunFilter(resList, gubun3, gubun4, grpgubun);
        // console.log("\n\njumun : " + resList);
    } else if (gubun2 == 2) {
        resList = siseFilter(resList, gubun3, grpgubun);
    } else if (gubun2 == 3) {
        // PB 조회
        resList = pbFilter(resList, gubun3, gubun4);
    } else if (gubun2 == 0) {
        // 전체 조회
        var noAuth = ["NOAUTH"];
        var tmpList1 = [];
        var tmpList2 = [];
        var authCnt = 0;

        tmpList1 = jumunFilter(resList, gubun3, gubun4, grpgubun);
        tmpList2 = siseFilter(resList, gubun3, grpgubun);
        //전체를 보기위해 주문 시세 함수 따로 주문 noauth 시세 noAuth 주문 시세 둘중 하나라도 noauth면 그건 없어져야함
        if (tmpList1[0] != "NOAUTH") {
            authCnt++;
        } else {
            tmpList1 = []; //권한이 없으면 초기화
        }
        if (tmpList2[0] != "NOAUTH") {
            authCnt++;
        } else {
            tmpList2 = []; //
        }

        if (authCnt == 0) { // 전부 Noauth 권한이 둘다 하나도 없는것.
            resList = noAuth;
        } else {
            resList = tmpList1.concat(tmpList2); //하나라도 카운트가 올라가면(권한이 있다는것이니) 더해서 보여줌 
        }
    }
    // console.log("stock :" + resList);
    return resList;
}

var customFilter = function(resList, gubun4) {

    var outList = [];
    //  회원사명 필터
    if (gubun4 !== "") {
        var rename = gubun4.split(',');
        console.log('rename : ' + rename);
        console.log('gubun4. : ' + gubun4.length);
        for (var i = 0; i < rename.length; i++) {
            for (var j = 0; j < resList.length; j++) {
                if ((resList[j].indexOf(rename[i]) !== -1)) {
                    var username = resList[j].split('_');
                    if (username[1] == rename[i]) {
                        outList.push(resList[j]);
                    }
                    console.log('username [1]  : ' + username[1]);
                    console.log('rename[i]' + rename[i]);
                }
            }
        }
    } else { //회원사 전체면
        outList = resList;
    }
    return outList;
}

var errSend = function(res, msg) {
    var resBody = {};

    resBody = {
        "success": false,
        "message": msg
    };
    console.log("msg : " + msg);
    res.json(resBody);
    res.end();
}

var succSend = function(res, resBody) {
    resBody.success = true;
    res.json(resBody);
    res.end();
}

var getUserChartListTerm = function(req, res) {
    console.log('/user/chart/getChartListTerm 호출됨.');

    var sdate = req.body.indate;
    var edate = req.body.indate1;
    var gubun1 = req.body.gubun1; // 표기 방식
    var gubun2 = req.body.gubun2; // 대분류
    var gubun3 = req.body.gubun3; // 중분류
    var gubun4 = req.body.gubun4; // 회원사명
    var grpgubun = req.body.grpgubun; // 회원사명

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }
    // else if (gubun2 != 3 && gubun4 == 0) {
    //     errSend(res, "기간조회에서는 전체 회원사 정보를 제공하지 않습니다!");
    //     return;
    // }

    var fs = require('fs');
    var topdir = "./public/Traffic/";
    var rddir = "";
    var resBody = {};
    var dataList = [];
    var curDate = "";
    var authGubun = 0;

    fs.readdir(topdir, function(err, data) {
        console.log(data);

        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            topList = dateFilter(topList, sdate, edate);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);
                fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3, gubun4, grpgubun); //조회한 기간 폴더 갯수만큼 forEach
                if (fileList.length != 1 || fileList[0] != "NOAUTH") { //권한이 하나라도 있거나, 

                    fileList.forEach(function(el1, idx1, arr1) {
                        var clist = { 'imgsrc': "", 'xlssrc': "" };
                        clist.imgsrc = "/public/Traffic/" + curDate + "/" + el1;
                        el1 = el1.replace("png", "csv");
                        el1 = el1.replace("_0_", "_1_");
                        clist.xlssrc = "/public/Traffic_Excel/" + curDate + "/" + el1;
                        dataList.push(clist);
                    });
                } else {
                    authGubun = 1;
                }
            });
            if (authGubun != 1) {
                if (dataList.length > 0) {
                    resBody = { "clist": dataList };
                    succSend(res, resBody);
                } else {
                    errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
                }
            } else {
                errSend(res, "해당 권한이 없습니다.");
            }
        }
    });
}

var downloadFileTerm = function(req, res) {
    console.log('/user/chart 모듈 안에 있는 downloadFileTerm 호출됨.');

    var sdate = req.body.indate;
    var edate = req.body.indate1;
    var gubun1 = req.body.gubun1;
    var gubun2 = req.body.gubun2;
    var gubun3 = req.body.gubun3;
    var gubun4 = req.body.gubun4;
    var grpgubun = req.body.grpgubun; // 회원사명
    var fileGubun = req.body.filegubun;
    var resBody = {};
    var authGubun = 0;

    console.log("sdate : " + sdate);
    console.log("edate : " + edate);
    console.log("gubun1 : " + gubun1);
    console.log("gubun2 : " + gubun2);
    console.log("gubun3 : " + gubun3);
    console.log("gubun4 : " + gubun4);
    console.log("grpgubun : " + grpgubun);
    console.log("filegubun : " + fileGubun);

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }
    // else if (gubun2 != 3 && gubun4 == 0) {
    //     errSend(res, "기간조회에서는 전체 회원사 정보를 제공하지 않습니다!");
    //     return;
    // }

    var fs = require('fs');
    var JSZip = require('jszip');
    var topdir = "";

    var zip = new JSZip();
    var outFileName = "";
    var fileList = [];

    if (fileGubun == "EXCEL") {
        topdir = "./public/Traffic_Excel/";
        outFileName = "excel_" + sdate + "_" + edate + "_" + gubun4 + ".zip";
    } else {
        topdir = "./public/Traffic/";
        outFileName = "image_" + sdate + "_" + edate + "_" + gubun4 + ".zip";
    }

    fs.readdir(topdir, function(err, data) {
        console.log('/user/chart 모듈 안에 있는 downloadFileTerm 호출됨33333.');
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            var fileCnt = 0;
            topList = dateFilter(topList, sdate, edate);
            // console.log('\ntopList ::: ' + topList);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                var rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);
                fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3, gubun4, grpgubun);
                if (fileList.length != 1 || fileList[0] != "NOAUTH") {

                    fileList.forEach(function(el1, idx1, arr1) {
                        console.log(rddir + el1);
                        var stream = fs.createReadStream(rddir + el1);
                        zip.folder(curDate).file(el1, stream);
                        fileCnt += 1;
                    });
                } else {
                    authGubun = 1;
                }
            });
            if (authGubun != 1) {
                if (fileCnt > 0) {
                    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                        .pipe(fs.createWriteStream('./public/download/' + outFileName))
                        .on('finish', function() {
                            resBody = { "filename": outFileName };
                            succSend(res, resBody);
                        });
                } else {
                    errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
                }
            } else {
                errSend(res, "해당 권한이 없습니다.");
            }

        }
    });
};

module.exports.getUserChartList = getUserChartList;
module.exports.downloadFile = downloadFile;
module.exports.getUserChartListTerm = getUserChartListTerm;
module.exports.downloadFileTerm = downloadFileTerm;