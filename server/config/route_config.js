/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

module.exports = {
    route_info: [
        // 로그인
        { file: './admin/login', path: '/login', method: 'checkLogin',session: 'uncheck', type: 'post' },
        { file: './admin/login', path: '/updatevisitcount', method: 'countInfo', session: 'uncheck', type: 'post' },
        // [ 관리자 ]
        // 공지사항 NOTICE
        { file: './admin/board', path: '/board/liststory', method: 'listStory', session: 'check', type: 'get' },
        { file: './admin/board', path: '/board/insertstory', method: 'insertStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updatestory', method: 'updateStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/deletestory', method: 'deleteStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updateviewcount', method: 'updateViewCount', session: 'check', type: 'post' },
        // 차트 CHART 
        { file: './admin/chart', path: '/chart/userlist', method: 'getUserList', session: 'check', type: 'post' },
        { file: './admin/chart', path: '/chart/chartlist', method: 'getChartList', session: 'check', type: 'get' },
        { file: './admin/chart', path: '/chart/downloadfile', method: 'downloadFile', session: 'check', type: 'get' },
        { file: './admin/chart', path: '/chart/chartlistterm', method: 'getChartListTerm', session: 'check', type: 'get' },
        { file: './admin/chart', path: '/chart/downloadfileterm', method: 'downloadFileTerm', session: 'check', type: 'get' },
        // 사용자설정 USERS
        { file: './admin/users', path: '/users/userlist', method: 'userList', session: 'check', type: 'get' },
        { file: './admin/users', path: '/users/insertinfo', method: 'insertInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/users/updateinfo', method: 'updateInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/users/deleteinfo', method: 'deleteInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/resetcount', method: 'resetCount', session: 'check', type: 'post' },
        { file: './admin/users', path: '/confirmpassword', method: 'confirmPwd', session: 'check', type: 'post' },
        { file: './admin/users', path: '/getCableList', method: 'getCableList', session: 'check', type: 'get' },
        { file: './admin/users', path: '/getPBUserList', method: 'getPBUserList', session: 'check', type: 'get' },
        { file: './admin/users', path: '/users/insertpbinfo', method: 'insertPBInfo', session: 'check',  type: 'post' },
        { file: './admin/users', path: '/users/deletepbinfo', method: 'deletePBInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/users/idconfirm', method: 'useridcheck', session: 'check', type: 'post' },
        { file: './admin/users', path: '/failcountChange', method: 'failcntChange', session: 'check', type: 'get' },

        // [ 회원 ]
        // 공지사항 NOTICE
        { file: './user/board', path: '/user/board/liststory', method: 'listStory', session: 'check', type: 'get' },
        { file: './user/board', path: '/user/board/updateviewcount', method: 'updateViewCount', session: 'check', type: 'post' },
        // 차트 CHART
        { file: './user/chart', path: '/user/chart/chartlist', method: 'getUserChartList', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfile', method: 'downloadFile', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/chartlistterm', method: 'getUserChartListTerm', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfileterm', method: 'downloadFileTerm', session: 'check', type: 'post' },
        // 사용자설정 USERSET - 비밀번호 변경
        { file: './user/users', path: '/user/changepwd', method: 'changePwd', session: 'check', type: 'post' }
	]
}