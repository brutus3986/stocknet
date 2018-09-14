/*
 * 설정
 *
 * @date 2018-04-05
 * @author shjinji
 */

module.exports = {
    server_port: 8031,
    https_port: 443,
    // base_url: "http://stocknettest.koscom.co.kr",
    // db_url: "mongodb://localhost:27017/stocknet",
    db_url: "mongodb://127.0.0.1:27017/stocknet",
    db_schemas: [
        { file: './user_schema', collection: 'users', schemaName: 'UserSchema', modelName: 'UserModel' },
        { file: './count_schema', collection: 'vcounts', schemaName: 'CountSchema', modelName: 'CountModel' },
        { file: './board_schema', collection: 'boards', schemaName: 'BoardSchema', modelName: 'BoardModel' },
        { file: './pbcable_schema', collection: 'pbcables', schemaName: 'PBCableSchema', modelName: 'PBCableModel' }
    ],
    route_info: [
        // 로그인
        { file: './admin/login', path: '/login', method: 'checkLogin', type: 'post' },
        { file: './admin/login', path: '/updatevisitcount', method: 'countInfo', type: 'get' },
        { file: './admin/login', path: '/logincount', method: 'usersloginCount', type: 'get' },
        //공지사항
        { file: './admin/board', path: '/board/liststory', method: 'listStory', type: 'get' },
        { file: './admin/board', path: '/board/insertstory', method: 'insertStory', type: 'post' },
        { file: './admin/board', path: '/board/updatestory', method: 'updateStory', type: 'post' },
        { file: './admin/board', path: '/board/deletestory', method: 'deleteStory', type: 'post' },
        { file: './admin/board', path: '/board/updateviewcount', method: 'updateViewCount', type: 'post' },
        //차트
        { file: './admin/chart', path: '/chart/userlist', method: 'getUserList', type: 'post' },
        { file: './admin/chart', path: '/chart/chartlist', method: 'getChartList', type: 'get' },
        { file: './admin/chart', path: '/chart/downloadfile', method: 'downloadFile', type: 'get' },
        { file: './admin/chart', path: '/chart/chartlistterm', method: 'getChartListTerm', type: 'get' },
        { file: './admin/chart', path: '/chart/downloadfileterm', method: 'downloadFileTerm', type: 'get' },

        { file: './user/chart', path: '/user/chart/chartlist', method: 'getUserChartList', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfile', method: 'downloadFile', type: 'post' },
        { file: './user/chart', path: '/user/chart/chartlistterm', method: 'getUserChartListTerm', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfileterm', method: 'downloadFileTerm', type: 'post' },
        //사용자설정
        { file: './admin/users', path: '/users/userlist', method: 'userList', type: 'get' },
        { file: './admin/users', path: '/users/insertinfo', method: 'insertInfo', type: 'post' },
        { file: './admin/users', path: '/users/updateinfo', method: 'updateInfo', type: 'post' },
        { file: './admin/users', path: '/users/deleteinfo', method: 'deleteInfo', type: 'post' },
        { file: './admin/users', path: '/resetcount', method: 'resetCount', type: 'post' },
        { file: './admin/users', path: '/confirmpassword', method: 'confirmPwd', type: 'post' },
        { file: './admin/users', path: '/getCableList', method: 'getCableList', type: 'get' },
        { file: './admin/users', path: '/getPBUserList', method: 'getPBUserList', type: 'get' },
        { file: './admin/users', path: '/users/insertpbinfo', method: 'insertPBInfo', type: 'post' },
        { file: './admin/users', path: '/users/deletepbinfo', method: 'deletePBInfo', type: 'post' },
        { file: './admin/users', path: '/users/idconfirm', method: 'useridcheck', type: 'post' },
        //일반고객 비밀번호 변경
        { file: './admin/users', path: '/changepwd', method: 'changePwd', type: 'post' }
    ]
}