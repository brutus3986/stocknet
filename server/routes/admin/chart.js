/*
 * 차트을 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */
var getUserList = function(req, res) {
    console.log('/chart/getUserList 호출됨.');

    var gubun2 = req.body.gubun2; // 대분류
    var gubun3 = req.body.gubun3; // 중분류
    var tick = 0;

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var options = {};
        // gubun2 = 대분류 0: 전체, 1: 주문 , 2: 시세 , 3: PB
        if (gubun2 == 1) { //주문 선택
            var tick = 1;
            if (gubun3 == 0) { //중분류 전체 (주문전체, 시세전체)
                options["$or"] = [{ "route_gubun1": true },
                    { "route_gubun2": true },
                    { "route_gubun3": true },
                    { "route_gubun4": true }
                ];
            } else {
                options["route_gubun" + gubun3] = true;
            }

        } else if (gubun2 == 2) { //시세 선택
            var tick = 1;
            if (gubun3 == 0) {
                options["$or"] = [{ "market_gubun1": true },
                    { "market_gubun2": true },
                    { "market_gubun3": true },
                    { "market_gubun4": true },
                    { "market_gubun5": true },
                    { "market_gubun6": true },
                    { "market_gubun7": true },
                    { "market_gubun8": true }
                ];
            } else {
                options["market_gubun" + gubun3] = true;
            }
        } else if (gubun2 == 3) { //PB 선택
            var tick = 2;
        } else {

        }
        if (tick == 1) { //주문과 시세면..
            options["user_level"] = "normal";

            database.UserModel.getUserByGubun(options, function(err, results) {
                // console.log('유저리스트..'+results)
                var resBody = { "userlist": results };
                succSend(res, resBody);
            });
        } else {
            // PB는 회원 권한 체크 없음.
            database.PBCableModel.findPBUSerbyChart(function(err, results) {
                // console.log('유저리스트..'+results);
                var resBody = { "userlist": results };
                succSend(res, resBody);
            });
        }
    } else {
        errSend(res, "DB connection Error");
    }
};

//챠트 가져오기
var getChartList = function(req, res) {
    console.log('/chart/getChartList 호출됨.');

    var indate = req.query.indate;
    var gubun1 = req.query.gubun1; // 표기 방식
    var gubun2 = req.query.gubun2; // 대분류
    var gubun3 = req.query.gubun3; // 중분류
    var gubun4 = req.query.gubun4; // 회원사명

    console.log("indate : " + indate);
    console.log("gubun1 : " + gubun1);
    console.log("gubun2 : " + gubun2);
    console.log("gubun3 : " + gubun3);
    console.log("gubun4 : " + gubun4);

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

            if (gubun2 == 1 || gubun2 == 3) { //주문과 PB로 선택
                resList = stocknetFilter(resList, gubun1, gubun2, gubun3);
                resList = customFilter(resList, gubun4);
            } else if (gubun2 == 2) { //시세 선택
                resList = stocknetFilter(resList, gubun1, gubun2, gubun3);
            }

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
                // console.log(clist);
                dataList.push(clist);
            });

            if (dataList.length > 0) {
                resBody = { "clist": dataList };
                succSend(res, resBody);
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });

};

var downloadFile = function(req, res) {
    console.log('chart 모듈 안에 있는 downloadImage 호출됨.');

    var indate = req.query.indate;
    var gubun1 = req.query.gubun1;
    var gubun2 = req.query.gubun2;
    var gubun3 = req.query.gubun3;
    var gubun4 = req.query.gubun4;
    var fileGubun = req.query.filegubun;

    // console.log("indate : " + indate);
    // console.log("gubun1 : " + gubun1);
    // console.log("gubun2 : " + gubun2);
    // console.log("gubun3 : " + gubun3);
    // console.log("gubun4 : " + gubun4);
    // console.log("filegubun : " + fileGubun);
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

    if (fileGubun == "EXCEL") {
        console.log('엑셀')
        rddir = "./public/Traffic_Excel/" + indate + "/";
        outFileName = "excel_" + indate + ".zip";
    } else {
        console.log('이미지')
        rddir = "./public/Traffic/" + indate + "/";
        outFileName = "image_" + indate + ".zip";
    }

    fs.readdir(rddir, function(err, data) {
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var resList = data;

            if (gubun2 == 1 || gubun2 == 3) { //주문과 PB로 선택
                resList = stocknetFilter(resList, gubun1, gubun2, gubun3);
                resList = customFilter(resList, gubun4);
            } else if (gubun2 == 2) { //시세 선택
                resList = stocknetFilter(resList, gubun1, gubun2, gubun3);
            }

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
        }
    });
};

//기간챠트 가져오기
var getChartListTerm = function(req, res) {
    console.log('/chart/getChartListTerm 호출됨.');

    var sdate = req.query.indate;
    var edate = req.query.indate1;
    var gubun1 = req.query.gubun1; // 표기 방식
    var gubun2 = req.query.gubun2; // 대분류
    var gubun3 = req.query.gubun3; // 중분류
    var gubun4 = req.query.gubun4; // 회원사명

    console.log("sdate : " + sdate);
    console.log("edate : " + edate);
    console.log("gubun1 : " + gubun1);
    console.log("gubun2 : " + gubun2);
    console.log("gubun3 : " + gubun3);
    console.log("gubun4 : " + gubun4);
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

    console.log("rddir:::" + rddir);

    fs.readdir(topdir, function(err, data) {
        // console.log(data);
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            topList = dateFilter(topList, sdate, edate);

            topList.forEach(function(el, idx, array) {
                curDate = el;
                rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);

                if (gubun2 == 1 || gubun2 == 3) { //주문과 PB 선택
                    fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3);
                    fileList = customFilter(fileList, gubun4); //조회한 기간 폴더 갯수만큼 forEach
                } else if (gubun2 == 2) { //시세 선택
                    fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3);
                }

                fileList.forEach(function(el1, idx1, arr1) {
                    var clist = { 'imgsrc': "", 'xlssrc': "" };
                    clist.imgsrc = "/public/Traffic/" + curDate + "/" + el1;
                    el1 = el1.replace("png", "csv");
                    // console.log("바꾸기전: el1" + el1);
                    el1 = el1.replace("_0_", "_1_");
                    // console.log("바꾼후: el1" + el1);
                    clist.xlssrc = "/public/Traffic_Excel/" + curDate + "/" + el1;
                    dataList.push(clist);
                });
            });
            if (dataList.length > 0) {
                resBody = { "clist": dataList };
                succSend(res, resBody);
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });
};

var downloadFileTerm = function(req, res) {
    console.log('chart 모듈 안에 있는 downloadFileTerm 호출됨.');

    var sdate = req.query.indate;
    var edate = req.query.indate1;
    var gubun1 = req.query.gubun1;
    var gubun2 = req.query.gubun2;
    var gubun3 = req.query.gubun3;
    var gubun4 = req.query.gubun4;
    var fileGubun = req.query.filegubun;
    var resBody = {};

    // console.log("sdate : " + sdate);
    // console.log("edate : " + edate);
    // console.log("gubun1 : " + gubun1);
    // console.log("gubun2 : " + gubun2);
    // console.log("gubun3 : " + gubun3);
    // console.log("gubun4 : " + gubun4);
    // console.log("filegubun : " + fileGubun);

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
        // fileList = data;
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            var fileCnt = 0;
            topList = dateFilter(topList, sdate, edate);

            topList.forEach(function(el, idx, array) {
                curDate = el;
                var rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);

                if (gubun2 == 1 || gubun2 == 3) { //주문과 PB 선택
                    fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3);
                    fileList = customFilter(fileList, gubun4); //조회한 기간 폴더 갯수만큼 forEach
                } else if (gubun2 == 2) { //시세 선택
                    fileList = stocknetFilter(fileList, gubun1, gubun2, gubun3);
                }

                fileList.forEach(function(el1, idx1, arr1) {
                    console.log(rddir + el1);
                    var stream = fs.createReadStream(rddir + el1);
                    zip.folder(curDate).file(el1, stream);
                    fileCnt += 1;
                });
            });
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
            // console.log("el : " + el + " sdate : " + sdate + " edate : " + edate);
        }
    });

    return resList;
}

var stocknetFilter = function(resList, gubun1, gubun2, gubun3, gubun4) {
    var outList = [];
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
    if (gubun2 == 1) { //주문
        //gubun3 = 중분류 0:전체, 1:서울현물 , 2:서울파생 , 3:부산파생, 4:주문테스트
        if (gubun3 == 1) {
            resList = filterArr(resList, "_SPOT_");
            console.log('주문 서울현물 _SPOT_ 검색')
        } else if (gubun3 == 2) {
            resList = filterArr(resList, "_FUTURES_");
            console.log('주문 서울파생 _FUTURES_ 검색')
        } else if (gubun3 == 3) {
            resList = filterArr(resList, "_FUTUREB_");
            console.log('주문 부산파생 _FUTUREB_ 검색')
        } else if (gubun3 == 4) {
            resList = filterArr(resList, "_ORTEST_");
            console.log('주문 주문테스트 _ORTEST_ 검색')
        } else if (gubun3 == 0) {
            // 주문 전체 조회
            console.log('주문 전체조회 ')
            outList = outList.concat(filterArr(resList, "_SPOT_"));
            outList = outList.concat(filterArr(resList, "_FUTURES_"));
            outList = outList.concat(filterArr(resList, "_FUTUREB_"));
            outList = outList.concat(filterArr(resList, "_ORTEST_"));
            // console.log('========================')
            // console.log(outList)
            // console.log('========================')
            resList = outList;
        }
    } else if (gubun2 == 2) { //시세
        // gubun3 = 중분류 0:전체, 1:유가, 2:코스닥, 3:ELW, 4:채권, 5:지수옵션, 6:선물, 7:부산파생시세, 8:시세테스트,
        if (gubun3 == 1) {
            resList = filterArr(resList, "_MD_YUGA_");
            console.log('시세 유가 _YUGA_ 검색')
        } else if (gubun3 == 2) {
            resList = filterArr(resList, "_MD_KOSDAQ_");
            console.log('시세 코스닥 _KOSDAQ_ 검색')
        } else if (gubun3 == 3) {
            resList = filterArr(resList, "_MD_ELW_");
            console.log('시세 ELW _ELW_ 검색')
        } else if (gubun3 == 4) {
            resList = filterArr(resList, "_MD_BOND_");
            console.log('시세 채권 _BOND_ 검색')
        } else if (gubun3 == 5) {
            resList = filterArr(resList, "_MD_OPT_");
            console.log('시세 지수옵션 _OPT_ 검색')
        } else if (gubun3 == 6) {
            resList = filterArr(resList, "_MD_SUNMUL_");
            console.log('시세 선물 _SUNMUL_ 검색')
        } else if (gubun3 == 7) {
            resList = filterArr(resList, "_MD_BS_");
            console.log('시세 부산파생시세 _MD_BS_ 검색')
        } else if (gubun3 == 8) {
            resList = filterArr(resList, "_MDTEST_");
            console.log('시세 시세테스트 _MDTEST_ 검색')
        } else {
            // 시세 전체 조회 (시세 + 시세테스트)= MD + MDTEST
            console.log('시세 전체 조회')
            outList = outList.concat(filterArr(resList, "_MD_YUGA_"));
            outList = outList.concat(filterArr(resList, "_MD_KOSDAQ_"));
            outList = outList.concat(filterArr(resList, "_MD_ELW_"));
            outList = outList.concat(filterArr(resList, "_MD_BOND_"));
            outList = outList.concat(filterArr(resList, "_MD_OPT_"));
            outList = outList.concat(filterArr(resList, "_MD_SUNMUL_"));
            outList = outList.concat(filterArr(resList, "_MD_BS_"));
            outList = outList.concat(filterArr(resList, "_MDTEST_"));
            // console.log('========================')
            // console.log(outList)
            // console.log('========================')
            resList = outList;
        }
    } else if (gubun2 == 3) { //PB
        // 중분류 gubun3 =  0:전체, 1:API, 2:BCP, 3:채권공시, 4:CTI, 5:그룹웨어, 6:HTS, 7:인터넷, 8:KOSMOS
        // 중분류 gubun3 = 9:MG, 10:MMF, 11:MTS, 12:NFS, 13:장외채권, 14:PB, 15:원장, 16:기타
        resList = filterArr(resList, "P_PB_"); //PB구분자 중에서........PB는 6/12일자만 있음

        var outList = [];
        // console.log('resList ::' + resList)
        if (gubun3 == 1) { //1:API,
            outList = outList.concat(filterArr(resList, "_API_"));
            outList = outList.concat(filterArr(resList, "_HAPI_"));
            outList = outList.concat(filterArr(resList, "_SAPI_"));
            outList = outList.concat(filterArr(resList, "_APIBCP_"));
            outList = outList.concat(filterArr(resList, "_APIDR_"));
            outList = outList.concat(filterArr(resList, "_APIDRTEST_"));
            outList = outList.concat(filterArr(resList, "_APITEST_"));
            // console.log('PB outlist:' + outList);
            console.log('PB _API_ 검색')
        } else if (gubun3 == 2) { //2:BCP
            outList = filterArr(resList, "_BCP_");
            // console.log('PB outlist:' + outList);
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
            outList = outList.concat(filterArr(resList, "_PB_M_")); //PB
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
    } else {
        // 전체 조회 
    }

    return resList;
}

//  회원사명 필터
var customFilter = function(resList, gubun4) {
    var outList = [];

    //특정 회원사 선택
    if (gubun4 !== "") {
        var rename = gubun4.split(',')
        for (var i = 0; i < rename.length; i++) {
            for (var j = 0; j < resList.length; j++) {
                if (resList[j].indexOf(rename[i]) !== -1) {
                    outList.push(resList[j]);
                }
            }
        }
        // console.log('outList:' + outList);
    } else { //회원사전체
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
    // console.log("msg : " + msg);
    res.json(resBody);
    res.end();
}

var succSend = function(res, resBody) {
    resBody.success = true;
    res.json(resBody);
    res.end();
}

module.exports.getUserList = getUserList;
module.exports.getChartList = getChartList;
module.exports.downloadFile = downloadFile;
module.exports.getChartListTerm = getChartListTerm;
module.exports.downloadFileTerm = downloadFileTerm;